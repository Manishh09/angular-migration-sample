import { Component, OnInit, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { SnackbarService } from '../../shared/services/snackbar.service';
import { ProfileService, UserProfile } from './services/profile.service';
import { Subject, finalize, takeUntil } from 'rxjs';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileComponent implements OnInit, OnDestroy {
  profileForm: FormGroup;
  isEditing = false;
  userInitials = '';
  lastUpdated = new Date();
  avatarColor = '#3f51b5'; // Default Material primary color
  loading = false;
  
  private destroy$ = new Subject<void>();
  
  constructor(
    private fb: FormBuilder,
    public authService: AuthService,
    private snackbarService: SnackbarService,
    private profileService: ProfileService
  ) {
    this.profileForm = this.fb.group({
      firstName: this.fb.control('', [Validators.required]),
      lastName: this.fb.control('', [Validators.required]),
      email: this.fb.control('', [Validators.required, Validators.email]),
      phone: this.fb.control('', [Validators.pattern(/^\+?[0-9\s\-\(\)]+$/)]),
      bio: this.fb.control('', [Validators.maxLength(500)])
    });
    
    // Disable form fields initially
    this.profileForm.disable();
  }
  
  ngOnInit(): void {
    this.loadUserProfile();
  }
  
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  
  toggleEditMode(): void {
    this.isEditing = !this.isEditing;
    
    if (this.isEditing) {
      this.profileForm.enable();
    } else {
      this.profileForm.disable();
    }
  }
  
  saveProfile(): void {
    if (this.profileForm.invalid) {
      return;
    }
    
    this.loading = true;
    
    // Convert form values to UserProfile and handle potential null values
    const formValues = this.profileForm.getRawValue();
    const profileData: UserProfile = {
      firstName: formValues.firstName || '',
      lastName: formValues.lastName || '',
      email: formValues.email || '',
      phone: formValues.phone || '',
      bio: formValues.bio || ''
    };
    
    this.profileService.saveUserProfile(profileData)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => this.loading = false)
      )
      .subscribe({
        next: () => {
          this.lastUpdated = new Date();
          this.snackbarService.success('Profile updated successfully!');
          this.toggleEditMode();
          this.generateUserInitials();
        },
        error: (error) => {
          this.snackbarService.error('Failed to update profile. Please try again.');
          console.error('Profile update error:', error);
        }
      });
  }
  
  cancelEdit(): void {
    this.loadUserProfile();
    this.toggleEditMode();
  }
  
  private loadUserProfile(): void {
    this.loading = true;
    
    this.profileService.getUserProfile()
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => this.loading = false)
      )
      .subscribe({
        next: (userData: UserProfile) => {
          this.profileForm.patchValue(userData);
          this.generateUserInitials();
        },
        error: (error) => {
          this.snackbarService.error('Failed to load profile data. Please refresh the page.');
          console.error('Profile load error:', error);
        }
      });
  }
  
  private generateUserInitials(): void {
    const firstName = this.profileForm.get('firstName')?.value || '';
    const lastName = this.profileForm.get('lastName')?.value || '';
    
    if (firstName && lastName) {
      this.userInitials = (firstName.charAt(0) + lastName.charAt(0)).toUpperCase();
    } else if (firstName) {
      this.userInitials = firstName.substring(0, 2).toUpperCase();
    } else {
      this.userInitials = 'U';
    }
    
    // Generate a consistent color based on the user's name
    this.generateAvatarColor(firstName + lastName);
  }
  
  private generateAvatarColor(name: string): void {
    if (!name) {
      this.avatarColor = '#3f51b5'; // Default Material primary color
      return;
    }
    
    // Simple hash function to generate a consistent color for the same name
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    // Convert the hash to a color
    let color = '#';
    for (let i = 0; i < 3; i++) {
      const value = (hash >> (i * 8)) & 0xFF;
      color += ('00' + value.toString(16)).substring(-2);
    }
    
    // Make sure the color is not too light for white text
    this.avatarColor = this.ensureContrastColor(color);
  }
  
  private ensureContrastColor(color: string): string {
    // Convert hex to RGB
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);
    
    // Check if the color is too light (using relative luminance)
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    
    if (luminance > 0.7) {
      // If too light, darken it
      const darken = 0.7 - luminance + 0.2; // Adjustment factor
      return `hsl(${this.rgbToHsl(r, g, b)[0]}, 70%, ${Math.max(20, 50 - darken * 100)}%)`;
    }
    
    return color;
  }
  
  private rgbToHsl(r: number, g: number, b: number): [number, number, number] {
    r /= 255;
    g /= 255;
    b /= 255;
    
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0, s = 0;
    const l = (max + min) / 2;
    
    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      
      h /= 6;
    }
    
    return [h * 360, s * 100, l * 100];
  }
  
  get fullName(): string {
    const firstName = this.profileForm.get('firstName')?.value || '';
    const lastName = this.profileForm.get('lastName')?.value || '';
    return `${firstName} ${lastName}`.trim();
  }
  
  get formControls() {
    return this.profileForm.controls;
  }
}
