import { Injectable } from '@angular/core';
import { CanActivate, CanLoad, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { SnackbarService } from '../../shared/services/snackbar.service';

/**
 * Guard that protects routes requiring authentication
 */
@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanLoad {
  
  constructor(
    private authService: AuthService,
    private router: Router,
    private snackbarService: SnackbarService
  ) {}
  
  /**
   * Determines if a route can be activated based on authentication status
   * @returns boolean, UrlTree, Observable<boolean | UrlTree> or Promise<boolean | UrlTree>
   */
  canActivate(): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    return this.checkAuth();
  }
  
  /**
   * Determines if a lazy-loaded module can be loaded based on authentication status
   * @returns boolean, Observable<boolean> or Promise<boolean>
   */
  canLoad(): boolean | Observable<boolean> | Promise<boolean> {
    if (this.authService.isLoggedIn()) {
      return true;
    }
    
    this.snackbarService.warning('You need to log in to access this page');
    this.router.navigate(['/auth/login']);
    return false;
  }
  
  /**
   * Checks if the user is authenticated
   * @returns boolean or UrlTree indicating if user is authenticated or redirect
   * @private
   */
  private checkAuth(): boolean | UrlTree {
    if (this.authService.isLoggedIn()) {
      return true;
    }
    
    this.snackbarService.warning('You need to log in to access this page');
    return this.router.createUrlTree(['/auth/login']);
  }
}
