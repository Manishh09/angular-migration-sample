import { Injectable } from '@angular/core';
import { 
  CanActivate, 
  CanLoad, 
  Route, 
  UrlSegment, 
  ActivatedRouteSnapshot, 
  RouterStateSnapshot, 
  UrlTree,
  Router
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { SnackbarService } from '../../shared/services/snackbar.service';

/**
 * Guard that protects routes requiring admin authentication
 */
@Injectable({
  providedIn: 'root'
})
export class AdminAuthGuard implements CanActivate, CanLoad {
  
  constructor(
    private authService: AuthService,
    private router: Router,
    private snackbarService: SnackbarService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.checkAdminAccess();
  }

  canLoad(
    route: Route,
    segments: UrlSegment[]
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.checkAdminAccess();
  }

  private checkAdminAccess(): boolean | UrlTree {
    // Check if user is both logged in and has admin role
    if (this.authService.isLoggedIn() && this.authService.isAdmin()) {
      return true;
    }
    
    // If not allowed, show a message and redirect to home
    this.snackbarService.error('You need admin privileges to access this area');
    return this.router.createUrlTree(['/home']);
  }
}
