import { Component, OnInit, ChangeDetectionStrategy, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SnackbarService } from '../../../shared/services/snackbar.service';
import { SettingsService, NotificationSettings, DEFAULT_NOTIFICATION_SETTINGS } from '../services/settings.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-notification-settings',
  templateUrl: './notification-settings.component.html',
  styleUrls: ['./notification-settings.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NotificationSettingsComponent implements OnInit, OnDestroy {
  notificationsForm!: FormGroup;
  private destroy$ = new Subject<void>();
  
  constructor(
    private fb: FormBuilder,
    private snackbarService: SnackbarService,
    private settingsService: SettingsService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.loadSettings();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initForm(): void {
    this.notificationsForm = this.fb.group({
      emailNotifications: [DEFAULT_NOTIFICATION_SETTINGS.emailNotifications],
      pushNotifications: [DEFAULT_NOTIFICATION_SETTINGS.pushNotifications],
      marketingEmails: [DEFAULT_NOTIFICATION_SETTINGS.marketingEmails],
      activitySummary: [DEFAULT_NOTIFICATION_SETTINGS.activitySummary]
    });

    // Subscribe to form value changes to update the service
    this.notificationsForm.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(values => {
        // Only update if the form is valid
        if (this.notificationsForm.valid) {
          this.settingsService.updateNotificationSettings(values as NotificationSettings);
        }
      });
  }

  private loadSettings(): void {
    this.settingsService.getNotificationSettings()
      .pipe(takeUntil(this.destroy$))
      .subscribe(settings => {
        this.notificationsForm.patchValue(settings, { emitEvent: false });
        this.cdr.markForCheck();
      });
  }

  saveNotificationSettings(): void {
    if (this.notificationsForm.invalid) return;
    
    const settings = this.notificationsForm.value as NotificationSettings;
    
    this.settingsService.saveNotificationSettings(settings)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.snackbarService.success('Notification settings saved successfully');
      });
  }
  
  resetDefaults(): void {
    // Reset form to default values
    this.notificationsForm.patchValue(DEFAULT_NOTIFICATION_SETTINGS);
    this.snackbarService.info('Notification settings reset to default');
  }
}
