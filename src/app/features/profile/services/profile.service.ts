import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { AuthService } from '../../../core/services/auth.service';

export interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  bio: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  constructor(private authService: AuthService) {}

  /**
   * Get the current user's profile data
   * @returns Observable of UserProfile
   */
  getUserProfile(): Observable<UserProfile> {
    // Mock user data - in a real app, this would come from an API
    const userData: UserProfile = {
      firstName: this.authService.isAdmin() ? 'Admin' : 'User',
      lastName: 'Account',
      email: this.authService.isAdmin() ? 'admin@example.com' : 'user@example.com',
      phone: '+1 (555) 123-4567',
      bio: 'This is a mock user profile for demonstration purposes. In a real application, this information would be loaded from a user profile service or API.'
    };
    
    // Simulate network delay
    return of(userData).pipe(delay(300));
  }

  /**
   * Save updated user profile data
   * @param profile Updated profile data
   * @returns Observable of operation success
   */
  saveUserProfile(profile: UserProfile): Observable<boolean> {
    // In a real app, this would send the data to an API
    // Mock save operation
    return of(true).pipe(delay(800));
  }
}
