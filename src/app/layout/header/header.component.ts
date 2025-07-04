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
    this.authService.logout();
    this.snackbarService.success('You have been logged out successfully');
    this.router.navigate(['/auth/login']);
  }
}
