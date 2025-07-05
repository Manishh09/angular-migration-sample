import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, takeUntil, finalize } from 'rxjs';
import { AdminService } from '../services/admin.service';
import { SnackbarService } from '../../../shared/services/snackbar.service';
import { AdminSettings } from '../models/dashboard-stats.model';

@Component({
  selector: 'app-admin-settings',
  templateUrl: './admin-settings.component.html',
  styleUrls: ['./admin-settings.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminSettingsComponent implements OnInit, OnDestroy {
  settingsForm!: FormGroup;
  isSaving = false;
  
  // For unsubscribing when component is destroyed
  private readonly destroy$ = new Subject<void>();
  
  constructor(
    private readonly fb: FormBuilder,
    private readonly adminService: AdminService,
    private readonly snackbarService: SnackbarService,
    private readonly cdr: ChangeDetectorRef
  ) { }
  ngOnInit(): void {
    this.initForm();
    this.loadSettings();
  }
  
  ngOnDestroy(): void {
    // Clean up subscriptions to prevent memory leaks
    this.destroy$.next();
    this.destroy$.complete();
  }

  initForm(): void {
    this.settingsForm = this.fb.group({
      appName: ['', [Validators.required, Validators.minLength(3)]],
      adminEmail: ['', [Validators.required, Validators.email]],
      darkTheme: [false]
    });
  }

  loadSettings(): void {
    // Mock loading settings (in a real app, this would come from the service)
    this.settingsForm.patchValue({
      appName: 'Angular Migration Sample',
      adminEmail: 'admin@example.com',
      darkTheme: false
    });
  }
  saveSettings(): void {
    if (this.settingsForm.invalid) {
      return;
    }

    this.isSaving = true;
    this.cdr.markForCheck();

    this.adminService.saveSettings(this.settingsForm.value)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => {
          this.isSaving = false;
          this.cdr.markForCheck();
        })
      )
      .subscribe({
        next: () => {
          this.snackbarService.success('Settings saved successfully');
        },
        error: () => {
          this.snackbarService.error('Error saving settings');
        }
      });
  }
}
