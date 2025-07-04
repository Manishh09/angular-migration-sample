import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SnackbarService } from '../../../shared/services/snackbar.service';

@Component({
  selector: 'app-notification-settings',
  templateUrl: './notification-settings.component.html',
  styleUrls: ['./notification-settings.component.scss']
})
export class NotificationSettingsComponent implements OnInit {
  notificationsForm!: FormGroup;
  
  // Default notification settings
  private defaultSettings = {
    emailNotifications: true,
    pushNotifications: true,
    marketingEmails: false,
    activitySummary: true
  };
  
  constructor(
    private fb: FormBuilder,
    private snackbarService: SnackbarService
  ) { }

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.notificationsForm = this.fb.group({
      emailNotifications: [this.defaultSettings.emailNotifications],
      pushNotifications: [this.defaultSettings.pushNotifications],
      marketingEmails: [this.defaultSettings.marketingEmails],
      activitySummary: [this.defaultSettings.activitySummary]
    });
  }

  saveNotificationSettings(): void {
    if (this.notificationsForm.invalid) return;
    
    // In a real app, you would save notification preferences to a service/API
    console.log('Notification settings:', this.notificationsForm.value);
    this.snackbarService.success('Notification settings saved successfully');
  }
  
  resetDefaults(): void {
    // Reset form to default values
    this.notificationsForm.patchValue(this.defaultSettings);
    this.snackbarService.info('Notification settings reset to default');
  }
}
