import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { By } from '@angular/platform-browser';

import { LoginComponent } from './login.component';
import { MaterialModule } from '../../../material/material.module';
import { AuthService } from '../../../core/services/auth.service';
import { SnackbarService } from '../../../shared/services/snackbar.service';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let snackbarServiceSpy: jasmine.SpyObj<SnackbarService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['login', 'isLoggedIn', 'getUserRole']);
    snackbarServiceSpy = jasmine.createSpyObj('SnackbarService', ['success', 'error']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [
        ReactiveFormsModule,
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

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    authServiceSpy.isLoggedIn.and.returnValue(false);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with empty values', () => {
    expect(component.loginForm.get('username')?.value).toBe('');
    expect(component.loginForm.get('password')?.value).toBe('');
    expect(component.loginForm.get('rememberMe')?.value).toBe(false);
  });

  it('should require username and password', () => {
    const usernameControl = component.loginForm.get('username');
    const passwordControl = component.loginForm.get('password');
    
    usernameControl?.setValue('');
    passwordControl?.setValue('');
    
    expect(usernameControl?.valid).toBeFalsy();
    expect(passwordControl?.valid).toBeFalsy();
    expect(component.loginForm.valid).toBeFalsy();
  });

  it('should redirect to home if already logged in', () => {
    authServiceSpy.isLoggedIn.and.returnValue(true);
    component.ngOnInit();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/home']);
  });

  it('should call authService.login with form values on submit', fakeAsync(() => {
    // Setup successful login
    authServiceSpy.login.and.returnValue(true);
    authServiceSpy.getUserRole.and.returnValue('Admin');
    
    // Fill the form
    component.loginForm.setValue({
      username: 'admin',
      password: 'password123',
      rememberMe: true
    });
    
    // Submit the form
    component.onSubmit();
    expect(component.isLoading).toBe(true);
    
    tick(1000); // Wait for the timeout
    
    expect(authServiceSpy.login).toHaveBeenCalledWith('admin', 'password123');
    expect(snackbarServiceSpy.success).toHaveBeenCalled();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/home']);
    expect(component.isLoading).toBe(false);
  }));

  it('should show error message on login failure', fakeAsync(() => {
    // Setup failed login
    authServiceSpy.login.and.returnValue(false);
    
    // Fill the form
    component.loginForm.setValue({
      username: 'wronguser',
      password: 'wrongpass',
      rememberMe: false
    });
    
    // Submit the form
    component.onSubmit();
    
    tick(1000); // Wait for the timeout
    
    expect(authServiceSpy.login).toHaveBeenCalledWith('wronguser', 'wrongpass');
    expect(snackbarServiceSpy.error).toHaveBeenCalled();
    expect(routerSpy.navigate).not.toHaveBeenCalled();
    expect(component.isLoading).toBe(false);
  }));
});
