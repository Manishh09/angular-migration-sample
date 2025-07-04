import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from '../../../material/material.module';

import { HomeComponent } from './home.component';
import { AuthService } from '../../../core/services/auth.service';
import { SnackbarService } from '../../../shared/services/snackbar.service';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let snackbarServiceSpy: jasmine.SpyObj<SnackbarService>;

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['isAdmin']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    snackbarServiceSpy = jasmine.createSpyObj('SnackbarService', ['error', 'success', 'warning', 'info']);

    await TestBed.configureTestingModule({
      declarations: [HomeComponent],
      imports: [
        RouterTestingModule,
        MaterialModule,
        NoopAnimationsModule
      ],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: SnackbarService, useValue: snackbarServiceSpy }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to users page if user is admin', () => {
    authServiceSpy.isAdmin.and.returnValue(true);
    
    component.navigateToUsers();
    
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/user']);
    expect(snackbarServiceSpy.error).not.toHaveBeenCalled();
  });

  it('should show snackbar if user is not admin', () => {
    authServiceSpy.isAdmin.and.returnValue(false);
    
    component.navigateToUsers();
    
    expect(routerSpy.navigate).not.toHaveBeenCalled();
    expect(snackbarServiceSpy.error).toHaveBeenCalledWith(
      '🚫 Access Denied: Only Admins can view User Management.'
    );
  });
});
