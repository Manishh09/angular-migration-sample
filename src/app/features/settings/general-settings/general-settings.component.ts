import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SnackbarService } from '../../../shared/services/snackbar.service';

@Component({
  selector: 'app-general-settings',
  templateUrl: './general-settings.component.html',
  styleUrls: ['./general-settings.component.scss']
})
export class GeneralSettingsComponent implements OnInit {
  generalForm!: FormGroup;
  
  constructor(
    private fb: FormBuilder,
    private snackbarService: SnackbarService
  ) { }

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.generalForm = this.fb.group({
      language: ['english'],
      timezone: ['UTC'],
      dateFormat: ['MM/DD/YYYY'],
      theme: ['light']
    });
  }

  saveGeneralSettings(): void {
    if (this.generalForm.invalid) return;
    
    // In a real app, you would save these settings to a service/API
    console.log('General settings:', this.generalForm.value);
    this.snackbarService.success('General settings saved successfully');
  }
  
  resetToDefaults(): void {
    this.generalForm.reset({
      language: 'english',
      timezone: 'UTC',
      dateFormat: 'MM/DD/YYYY',
      theme: 'light'
    });
    this.snackbarService.info('Settings reset to defaults');
  }
}
