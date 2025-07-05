import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { SnackbarService } from '../../../shared/services/snackbar.service';

/**
 * Types for navigation options to ensure type safety
 */
type NavigationRoute = '/user' | '/profile' | '/settings';
interface NavigationOptions {
  route: NavigationRoute;
  requiresAdmin: boolean;
  errorMessage?: string;
}

/**
 * Home Component
 * 
 * Main landing page component that displays a welcome card and provides
 * navigation to other parts of the application.
 */
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent implements OnInit {
  /**
   * Define navigation options with strict typing
   */
  private readonly userModuleNavigation: NavigationOptions = {
    route: '/user',
    requiresAdmin: true,
    errorMessage: '🚫 Access Denied: Only Admins can view User Management.'
  };

  /**
   * Initialize required services for navigation and notifications
   */
  constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly snackbarService: SnackbarService
  ) { }

  /**
   * Component initialization lifecycle hook
   */
  public ngOnInit(): void {
    // Currently no initialization required
  }

  /**
   * Navigate to the users section if the user has admin privileges
   * Otherwise, show an error message
   * 
   * @returns Promise<boolean> - Returns router navigation promise result
   */
  public navigateToUsers(): Promise<boolean> {
    return this.navigateWithPermissionCheck(this.userModuleNavigation);
  }

  /**
   * Generic method to handle navigation with permission checks
   * Uses strong typing for all parameters and return values
   * 
   * @param options - Strongly typed navigation options
   * @param extras - Optional router navigation extras
   * @returns Promise<boolean> - The result of the navigation attempt
   */
  private navigateWithPermissionCheck(
    options: NavigationOptions, 
    extras?: NavigationExtras
  ): Promise<boolean> {
    const { route, requiresAdmin, errorMessage } = options;
    
    if (!requiresAdmin || this.authService.isAdmin()) {
      return this.router.navigate([route], extras);
    } else {
      const message = errorMessage ?? 'Access denied: Insufficient permissions';
      this.snackbarService.error(message);
      return Promise.resolve(false);
    }
  }
}
