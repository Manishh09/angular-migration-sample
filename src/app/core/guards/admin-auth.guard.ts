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

@Injectable({
  providedIn: 'root'
})
export class AdminAuthGuard implements CanActivate, CanLoad {
  
  constructor(
    private authService: AuthService,
    private router: Router
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

  private checkAdminAccess(): boolean {
    // Check if user is both logged in and has admin role
    if (this.authService.isLoggedIn() && this.authService.isAdmin()) {
      return true;
    }
    
    // If not allowed, prevent route activation
    // You can optionally redirect here if needed
    // this.router.navigate(['/login']); // Uncomment to enable redirect
    
    return false;
  }
}
