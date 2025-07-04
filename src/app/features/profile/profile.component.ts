import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { SnackbarService } from '../../shared/services/snackbar.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup;
  isEditing = false;
  userInitials = '';
  lastUpdated = new Date();
  avatarColor = '#3f51b5'; // Default Material primary color
  
  constructor(
    private fb: FormBuilder,
    public authService: AuthService,
    private snackbarService: SnackbarService
  ) {
    this.profileForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.pattern(/^\+?[0-9\s\-\(\)]+$/)]],
      bio: ['', [Validators.maxLength(500)]]
    });
    
    // Disable form fields initially
    this.profileForm.disable();
  }
  
  ngOnInit(): void {
    this.loadUserProfile();
    this.generateUserInitials();
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
    
    // In a real app, you would send the data to an API
    // Mock save operation
    setTimeout(() => {
      this.lastUpdated = new Date(); // Update the timestamp
      this.snackbarService.success('Profile updated successfully!');
      this.toggleEditMode();
      this.generateUserInitials();
    }, 800);
  }
  
  cancelEdit(): void {
    this.loadUserProfile();
    this.toggleEditMode();
  }
  
  private loadUserProfile(): void {
    // Mock user data - in a real app, this would come from a service
    const userData = {
      firstName: this.authService.isAdmin() ? 'Admin' : 'User',
      lastName: 'Account',
      email: this.authService.isAdmin() ? 'admin@example.com' : 'user@example.com',
      phone: '+1 (555) 123-4567',
      bio: 'This is a mock user profile for demonstration purposes. In a real application, this information would be loaded from a user profile service or API.'
    };
    
    this.profileForm.patchValue(userData);
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
      color += ('00' + value.toString(16)).substr(-2);
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
    return `${this.profileForm.get('firstName')?.value || ''} ${this.profileForm.get('lastName')?.value || ''}`.trim();
  }
  
  get formControls() {
    return this.profileForm.controls;
  }
}
