import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';

import { AuthService } from '../../core/services/auth.service';
import { SnackbarService } from '../../shared/services/snackbar.service';

/**
 * Header Component
 * 
 * Main navigation component that appears at the top of every page.
 * Handles user authentication status and navigation controls.
 */
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  public username = 'Demo User';
  public isLoggingOut = false;
  private authSubscription: Subscription | null = null;

  constructor(
    // Public for template access
    public readonly authService: AuthService,
    private readonly router: Router,
    private readonly snackbarService: SnackbarService
  ) { }

  /**
   * Initialize component, set username and subscribe to auth changes
   */
  public ngOnInit(): void {
    // Set initial username
    this.setUserName();
    
    // Subscribe to auth changes
    this.authSubscription = this.authService.authChange$.subscribe(() => {
      this.setUserName();
    });
  }

  /**
   * Clean up resources when component is destroyed
   */
  public ngOnDestroy(): void {
    // Clean up subscription
    this.unsubscribeFromAuth();
  }

  /**
   * Unsubscribe from auth change events
   */
  private unsubscribeFromAuth(): void {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
      this.authSubscription = null;
    }
  }

  /**
   * Set the username based on authentication status and role
   */
  public setUserName(): void {
    // Set the username based on role
    if (this.authService.isLoggedIn()) {
      const role = this.authService.getUserRole();
      this.username = role === 'Admin' ? 'Admin User' : 'Regular User';
    } else {
      this.username = '';
    }
  }

  /**
   * Log the user out and redirect to login page
   */
  public logout(): void {
    // Prevent multiple logout attempts
    if (this.isLoggingOut) {
      return;
    }
    
    this.isLoggingOut = true;
    
    // Clean up subscription to prevent callbacks during logout
    this.unsubscribeFromAuth();
    
    // First perform the logout operation to clear auth data
    this.authService.logout().then(() => {
      // Then immediately navigate to login page
      this.router.navigate(['/auth/login']).then(() => {
        // After navigation is complete, show a subtle notification
        setTimeout(() => {
          this.snackbarService.success('You have been logged out successfully', 'OK', { 
            duration: 1000,
            verticalPosition: 'bottom',
            horizontalPosition: 'end',
            panelClass: ['logout-snackbar']
          })
          .pipe(take(1))
          .subscribe(() => {
            this.isLoggingOut = false;
          });
        }, 0);
      });
    });
  }
}
