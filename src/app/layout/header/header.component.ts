import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { SnackbarService } from '../../shared/services/snackbar.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  username = 'Demo User';
  isLoggingOut = false;
  private authSubscription?: Subscription;

  constructor(
    public authService: AuthService,
    private router: Router,
    private snackbarService: SnackbarService
  ) { }

  ngOnInit(): void {
    // Set initial username
    this.setUserName();
    
    // Subscribe to auth changes
    this.authSubscription = this.authService.authChange.subscribe(() => {
      this.setUserName();
    });
  }

  ngOnDestroy(): void {
    // Clean up subscription
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

  setUserName(): void {
    // Set the username based on role
    if (this.authService.isLoggedIn()) {
      const role = this.authService.getUserRole();
      this.username = role === 'Admin' ? 'Admin User' : 'Regular User';
    } else {
      this.username = '';
    }
  }

  logout(): void {
    // Prevent multiple logout attempts
    if (this.isLoggingOut) {
      return;
    }
    
    this.isLoggingOut = true;
    
    // Clean up subscription to prevent callbacks during logout
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
      this.authSubscription = undefined;
    }
    
    // First perform the logout operation to clear auth data
    this.authService.logout().then(() => {
      // Then immediately navigate to login page
      this.router.navigate(['/auth/login']).then(() => {
        // After navigation is complete, show a subtle notification
        // The setTimeout ensures the notification appears after the page has rendered
        setTimeout(() => {
          this.snackbarService.success('You have been logged out successfully', 'OK', { 
            duration:1000,
            verticalPosition: 'bottom',
            horizontalPosition: 'end',
            panelClass: ['logout-snackbar']
          }).subscribe(() => {
            this.isLoggingOut = false;
          });
        }, 0);
      });
    });
  }
}
