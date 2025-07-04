import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SnackbarService } from '../../../shared/services/snackbar.service';

@Component({
  selector: 'app-security-settings',
  templateUrl: './security-settings.component.html',
  styleUrls: ['./security-settings.component.scss']
})
export class SecuritySettingsComponent implements OnInit {
  securityForm!: FormGroup;
  
  // Password visibility toggles
  hideCurrentPassword = true;
  hideNewPassword = true;
  hideConfirmPassword = true;
  
  constructor(
    private fb: FormBuilder,
    private snackbarService: SnackbarService
  ) { }

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.securityForm = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [
        Validators.required, 
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
      ]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(group: FormGroup): { [key: string]: boolean } | null {
    const newPassword = group.get('newPassword')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    
    return newPassword === confirmPassword ? null : { passwordMismatch: true };
  }

  saveSecuritySettings(): void {
    if (this.securityForm.invalid) return;
    
    // In a real app, you would validate current password and update password via API
    console.log('Security settings:', this.securityForm.value);
    this.snackbarService.success('Password updated successfully');
    this.securityForm.reset();
    
    // Reset visibility toggles after form reset
    this.hideCurrentPassword = true;
    this.hideNewPassword = true;
    this.hideConfirmPassword = true;
  }
  
  resetForm(): void {
    // Reset the form to its initial state
    this.securityForm.reset();
    
    // Reset visibility toggles
    this.hideCurrentPassword = true;
    this.hideNewPassword = true;
    this.hideConfirmPassword = true;
    
    // Notify the user
    this.snackbarService.info('Form has been reset');
  }

  // Password strength methods
  getPasswordStrengthClass(level: number): string {
    if (!this.newPasswordControl?.value) return '';
    const password = this.newPasswordControl.value;
    const strength = this.calculatePasswordStrength(password);
    
    if (level < strength) {
      if (strength === 1) return 'weak';
      if (strength === 2) return 'medium';
      if (strength === 3) return 'strong';
      if (strength === 4) return 'very-strong';
    }
    return '';
  }
  
  getPasswordStrengthTextClass(): string {
    if (!this.newPasswordControl?.value) return '';
    const password = this.newPasswordControl.value;
    const strength = this.calculatePasswordStrength(password);
    
    if (strength === 1) return 'weak-text';
    if (strength === 2) return 'medium-text';
    if (strength === 3) return 'strong-text';
    if (strength === 4) return 'very-strong-text';
    return '';
  }
  
  getPasswordStrengthText(): string {
    if (!this.newPasswordControl?.value) return '';
    const password = this.newPasswordControl.value;
    const strength = this.calculatePasswordStrength(password);
    
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
  
  private calculatePasswordStrength(password: string): number {
    let strength = 0;
    
    if (this.hasMinLength(password)) strength += 1;
    if (this.hasUppercase(password) && this.hasLowercase(password)) strength += 1;
    if (this.hasNumber(password)) strength += 1;
    if (this.hasSpecialChar(password)) strength += 1;
    
    return strength;
  }

  get currentPasswordControl() { return this.securityForm.get('currentPassword'); }
  get newPasswordControl() { return this.securityForm.get('newPassword'); }
  get confirmPasswordControl() { return this.securityForm.get('confirmPassword'); }
  
  get passwordMismatch(): boolean {
    if (!this.securityForm) return false;
    
    return (this.securityForm.hasError('passwordMismatch') || false) && 
           !!this.confirmPasswordControl?.touched &&
           !!this.newPasswordControl?.touched &&
           !this.newPasswordControl?.hasError('required') &&
           !this.confirmPasswordControl?.hasError('required');
  }
}
