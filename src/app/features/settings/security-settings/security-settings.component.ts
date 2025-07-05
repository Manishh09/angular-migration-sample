import { Component, OnInit, ChangeDetectionStrategy, OnDestroy, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { SnackbarService } from '../../../shared/services/snackbar.service';
import { SettingsService, SecuritySettings } from '../services/settings.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

/**
 * Interface for password form data
 */
interface PasswordForm {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

/**
 * Password strength levels
 */
type PasswordStrengthLevel = 1 | 2 | 3 | 4;

@Component({
  selector: 'app-security-settings',
  templateUrl: './security-settings.component.html',
  styleUrls: ['./security-settings.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SecuritySettingsComponent implements OnInit, OnDestroy, AfterViewInit {
  securityForm!: FormGroup;
  private destroy$ = new Subject<void>();
  
  // Password visibility toggles
  hideCurrentPassword = true;
  hideNewPassword = true;
  hideConfirmPassword = true;
  
  constructor(
    private fb: FormBuilder,
    private snackbarService: SnackbarService,
    private settingsService: SettingsService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.initForm();
    
    // Make sure any existing pendingPasswordChange is reset
    this.settingsService.updateSecuritySettings({
      ...this.settingsService.getCurrentSecuritySettings(),
      pendingPasswordChange: false
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  
  // When this component is re-activated (tab selected)
  ngAfterViewInit(): void {
    // Check form state and update service accordingly
    setTimeout(() => this.checkFormState(), 0);
  }
  
  // Helper method to check if form has any values and update service accordingly
  private checkFormState(): void {
    const currentSettings: SecuritySettings = this.settingsService.getCurrentSecuritySettings();
    
    if (this.currentPasswordControl?.value || 
        this.newPasswordControl?.value || 
        this.confirmPasswordControl?.value) {
      // If any field has a value, mark as having changes
      this.settingsService.updateSecuritySettings({
        ...currentSettings,
        pendingPasswordChange: true
      });
    } else {
      // If all fields are empty, mark as having no changes
      this.settingsService.updateSecuritySettings({
        ...currentSettings,
        pendingPasswordChange: false
      });
    }
  }

  private initForm(): void {
    this.securityForm = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [
        Validators.required, 
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
      ]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
    
    // Subscribe to form value changes to update the service
    this.securityForm.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        const currentSettings: SecuritySettings = this.settingsService.getCurrentSecuritySettings();
        
        // Check if any of the fields have values - if so, mark as having pending changes
        if (this.currentPasswordControl?.value || 
            this.newPasswordControl?.value || 
            this.confirmPasswordControl?.value) {
          console.log('Security form changed - updating service with pending changes');
          // Immediately mark as having changes regardless of form validity
          this.settingsService.updateSecuritySettings({
            ...currentSettings,
            pendingPasswordChange: true
          });
        } else {
          // If all fields are empty, mark as having no changes
          console.log('Security form empty - updating service with no pending changes');
          this.settingsService.updateSecuritySettings({
            ...currentSettings,
            pendingPasswordChange: false
          });
        }
      });
  }

  private passwordMatchValidator(group: AbstractControl): ValidationErrors | null {
    const newPassword = group.get('newPassword')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    
    return newPassword === confirmPassword ? null : { passwordMismatch: true };
  }

  saveSecuritySettings(): void {
    if (this.securityForm.invalid) return;
    
    const formData: PasswordForm = this.securityForm.value as PasswordForm;
    
    this.settingsService.changePassword(formData.currentPassword, formData.newPassword)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.snackbarService.success('Password updated successfully');
        
        const currentSettings: SecuritySettings = this.settingsService.getCurrentSecuritySettings();
        
        // Explicitly mark as having no pending changes before resetting the form
        // to prevent the valueChanges from triggering another update
        this.settingsService.updateSecuritySettings({
          ...currentSettings,
          pendingPasswordChange: false
        });
        
        // Reset the form with {emitEvent: false} to avoid triggering valueChanges
        this.securityForm.reset({}, {emitEvent: false});
        
        // Reset visibility toggles after form reset
        this.hideCurrentPassword = true;
        this.hideNewPassword = true;
        this.hideConfirmPassword = true;
        
        this.cdr.markForCheck();
      });
  }
  
  resetForm(): void {
    const currentSettings: SecuritySettings = this.settingsService.getCurrentSecuritySettings();
    
    // First update the service to indicate there are no pending changes
    // This needs to happen before resetting the form
    this.settingsService.updateSecuritySettings({
      ...currentSettings,
      pendingPasswordChange: false
    });
    
    // Reset the form with {emitEvent: false} to avoid triggering valueChanges
    this.securityForm.reset({}, {emitEvent: false});
    
    // Reset visibility toggles
    this.hideCurrentPassword = true;
    this.hideNewPassword = true;
    this.hideConfirmPassword = true;
    
    // Notify the user
    this.snackbarService.info('Form has been reset');
    
    this.cdr.markForCheck();
  }

  // Password strength methods
  getPasswordStrengthClass(level: number): string {
    if (!this.newPasswordControl?.value) return '';
    const password: string = this.newPasswordControl.value;
    const strength: PasswordStrengthLevel = this.calculatePasswordStrength(password);
    
    if (level <= strength) {
      if (strength === 1) return 'weak';
      if (strength === 2) return 'medium';
      if (strength === 3) return 'strong';
      if (strength === 4) return 'very-strong';
    }
    return '';
  }
  
  getPasswordStrengthTextClass(): string {
    if (!this.newPasswordControl?.value) return '';
    const password: string = this.newPasswordControl.value;
    const strength: PasswordStrengthLevel = this.calculatePasswordStrength(password);
    
    if (strength === 1) return 'weak-text';
    if (strength === 2) return 'medium-text';
    if (strength === 3) return 'strong-text';
    if (strength === 4) return 'very-strong-text';
    return '';
  }
  
  getPasswordStrengthText(): string {
    if (!this.newPasswordControl?.value) return '';
    const password: string = this.newPasswordControl.value;
    const strength: PasswordStrengthLevel = this.calculatePasswordStrength(password);
    
    if (strength === 1) return 'Weak';
    if (strength === 2) return 'Medium';
    if (strength === 3) return 'Strong';
    if (strength === 4) return 'Very Strong';
    return '';
  }
  
  // Password requirement methods
  hasMinLength(password: string | null | undefined): boolean {
    return !!password && password.length >= 8;
  }
  
  hasUppercase(password: string | null | undefined): boolean {
    return !!password && /[A-Z]/.test(password);
  }
  
  hasLowercase(password: string | null | undefined): boolean {
    return !!password && /[a-z]/.test(password);
  }
  
  hasNumber(password: string | null | undefined): boolean {
    return !!password && /[0-9]/.test(password);
  }
  
  hasSpecialChar(password: string | null | undefined): boolean {
    return !!password && /[^A-Za-z0-9]/.test(password);
  }
  
  private calculatePasswordStrength(password: string): PasswordStrengthLevel {
    let strength = 0;
    
    if (this.hasMinLength(password)) strength += 1;
    if (this.hasUppercase(password) && this.hasLowercase(password)) strength += 1;
    if (this.hasNumber(password)) strength += 1;
    if (this.hasSpecialChar(password)) strength += 1;
    
    return (strength as PasswordStrengthLevel) || 1;
  }

  get currentPasswordControl() { 
    return this.securityForm.get('currentPassword'); 
  }
  
  get newPasswordControl() { 
    return this.securityForm.get('newPassword'); 
  }
  
  get confirmPasswordControl() { 
    return this.securityForm.get('confirmPassword'); 
  }
  
  get passwordMismatch(): boolean {
    if (!this.securityForm) return false;
    
    return (this.securityForm.hasError('passwordMismatch') || false) && 
           !!this.confirmPasswordControl?.touched &&
           !!this.newPasswordControl?.touched &&
           !this.newPasswordControl?.hasError('required') &&
           !this.confirmPasswordControl?.hasError('required');
  }
}
