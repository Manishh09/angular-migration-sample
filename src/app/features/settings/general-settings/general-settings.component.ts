import { Component, OnInit, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SnackbarService } from '../../../shared/services/snackbar.service';
import { SettingsService, GeneralSettings, DEFAULT_GENERAL_SETTINGS } from '../services/settings.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-general-settings',
  templateUrl: './general-settings.component.html',
  styleUrls: ['./general-settings.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GeneralSettingsComponent implements OnInit, OnDestroy {
  generalForm!: FormGroup;
  private destroy$ = new Subject<void>();
  
  constructor(
    private fb: FormBuilder,
    private snackbarService: SnackbarService,
    private settingsService: SettingsService
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
    this.generalForm = this.fb.group({
      language: [DEFAULT_GENERAL_SETTINGS.language, Validators.required],
      timezone: [DEFAULT_GENERAL_SETTINGS.timezone, Validators.required],
      dateFormat: [DEFAULT_GENERAL_SETTINGS.dateFormat, Validators.required],
      theme: [DEFAULT_GENERAL_SETTINGS.theme, Validators.required]
    });
  }

  private loadSettings(): void {
    this.settingsService.getGeneralSettings()
      .pipe(takeUntil(this.destroy$))
      .subscribe(settings => {
        this.generalForm.patchValue(settings);
      });
  }

  saveGeneralSettings(): void {
    if (this.generalForm.invalid) return;
    
    const settings = this.generalForm.value as GeneralSettings;
    
    this.settingsService.saveGeneralSettings(settings)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.snackbarService.success('General settings saved successfully');
      });
  }
  
  resetToDefaults(): void {
    this.generalForm.reset(DEFAULT_GENERAL_SETTINGS);
    this.snackbarService.info('Settings reset to defaults');
  }
}
