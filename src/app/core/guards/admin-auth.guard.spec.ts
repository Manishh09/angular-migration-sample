import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AdminAuthGuard } from './admin-auth.guard';
import { AuthService } from '../services/auth.service';

describe('AdminAuthGuard', () => {
  let guard: AdminAuthGuard;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(() => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['isLoggedIn', 'isAdmin']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        AdminAuthGuard,
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    });

    guard = TestBed.inject(AdminAuthGuard);
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should allow access when user is logged in and is admin', () => {
    authService.isLoggedIn.and.returnValue(true);
    authService.isAdmin.and.returnValue(true);

    expect(guard.canActivate(null!, null!)).toBe(true);
    expect(guard.canLoad(null!, null!)).toBe(true);
  });

  it('should deny access when user is logged in but not an admin', () => {
    authService.isLoggedIn.and.returnValue(true);
    authService.isAdmin.and.returnValue(false);

    expect(guard.canActivate(null!, null!)).toBe(false);
    expect(guard.canLoad(null!, null!)).toBe(false);
  });

  it('should deny access when user is not logged in', () => {
    authService.isLoggedIn.and.returnValue(false);
    authService.isAdmin.and.returnValue(false);

    expect(guard.canActivate(null!, null!)).toBe(false);
    expect(guard.canLoad(null!, null!)).toBe(false);
  });
});
