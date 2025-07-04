import { Injectable } from '@angular/core';
import { CanActivate, CanLoad, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { SnackbarService } from '../../shared/services/snackbar.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanLoad {
  
  constructor(
    private authService: AuthService,
    private router: Router,
    private snackbarService: SnackbarService
  ) {}
  
  canActivate(): boolean {
    return this.checkAuth();
  }
  
  canLoad(): boolean {
    return this.checkAuth();
  }
  
  private checkAuth(): boolean {
    if (this.authService.isLoggedIn()) {
      return true;
    }
    
    this.snackbarService.warning('You need to log in to access this page');
    this.router.navigate(['/auth/login']);
    return false;
  }
}
