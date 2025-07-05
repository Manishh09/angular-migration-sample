import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { AdminService } from '../services/admin.service';
import { SnackbarService } from '../../../shared/services/snackbar.service';
import { AdminSettings } from '../models/dashboard-stats.model';

@Component({
  selector: 'app-admin-settings',
  templateUrl: './admin-settings.component.html',
  styleUrls: ['./admin-settings.component.scss']
})
export class AdminSettingsComponent implements OnInit, OnDestroy {
  settingsForm!: FormGroup;
  isSaving = false;
  
  // For unsubscribing when component is destroyed
  private readonly destroy$ = new Subject<void>();
  
  constructor(
    private readonly fb: FormBuilder,
    private readonly adminService: AdminService,
    private readonly snackbarService: SnackbarService
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
      this.adminService.saveSettings(this.settingsForm.value).subscribe(
      response => {
        this.isSaving = false;
        this.snackbarService.success('Settings saved successfully');
      },
      error => {
        this.isSaving = false;
        this.snackbarService.error('Error saving settings');
      }
    );
  }
}
