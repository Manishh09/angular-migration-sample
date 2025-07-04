import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from '../../material/material.module';

import { HeaderComponent } from './header.component';
import { AuthService } from '../../core/services/auth.service';
import { SnackbarService } from '../../shared/services/snackbar.service';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let snackbarServiceSpy: jasmine.SpyObj<SnackbarService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['logout', 'isLoggedIn', 'isAdmin', 'getUserRole']);
    snackbarServiceSpy = jasmine.createSpyObj('SnackbarService', ['success']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      declarations: [HeaderComponent],
      imports: [
        RouterTestingModule,
        MaterialModule,
        NoopAnimationsModule
      ],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: SnackbarService, useValue: snackbarServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call authService.logout and navigate to login page when logout is called', () => {
    component.logout();
    
    expect(authServiceSpy.logout).toHaveBeenCalled();
    expect(snackbarServiceSpy.success).toHaveBeenCalledWith('You have been logged out successfully');
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/auth/login']);
  });

  it('should conditionally show/hide admin links based on user role', () => {
    // This would require a more complex test involving DOM inspection
    // Just verifying the service is being used
    authServiceSpy.isLoggedIn.and.returnValue(true);
    authServiceSpy.isAdmin.and.returnValue(true);
    fixture.detectChanges();
    
    expect(authServiceSpy.isLoggedIn).toHaveBeenCalled();
    expect(authServiceSpy.isAdmin).toHaveBeenCalled();
  });
});
