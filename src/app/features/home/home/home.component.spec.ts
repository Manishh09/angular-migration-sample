import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';
import { MaterialModule } from '../../../material/material.module';
import { DebugElement } from '@angular/core';

import { HomeComponent } from './home.component';
import { AuthService } from '../../../core/services/auth.service';
import { SnackbarService } from '../../../shared/services/snackbar.service';

/**
 * Test fixture types for better type-safety
 */
interface TestContext {
  component: HomeComponent;
  fixture: ComponentFixture<HomeComponent>;
  authService: jasmine.SpyObj<AuthService>;
  router: jasmine.SpyObj<Router>;
  snackbarService: jasmine.SpyObj<SnackbarService>;
  debugElement: DebugElement;
}

describe('HomeComponent', () => {
  let testContext: TestContext;

  beforeEach(async () => {
    // Create spies with typed return values for better type safety
    const authServiceSpy = jasmine.createSpyObj<AuthService>('AuthService', {
      isAdmin: false
    });
    
    const routerSpy = jasmine.createSpyObj<Router>('Router', {
      navigate: Promise.resolve(true)
    });
    
    const snackbarServiceSpy = jasmine.createSpyObj<SnackbarService>('SnackbarService', {
      error: undefined,
      success: undefined,
      warning: undefined,
      info: undefined
    });

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

    const fixture = TestBed.createComponent(HomeComponent);
    
    testContext = {
      component: fixture.componentInstance,
      fixture,
      authService: TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>,
      router: TestBed.inject(Router) as jasmine.SpyObj<Router>,
      snackbarService: TestBed.inject(SnackbarService) as jasmine.SpyObj<SnackbarService>,
      debugElement: fixture.debugElement
    };
    
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(testContext.component).toBeTruthy();
  });

  it('should navigate to users page if user is admin', async () => {
    // Arrange
    testContext.authService.isAdmin.and.returnValue(true);
    
    // Act
    const result = await testContext.component.navigateToUsers();
    
    // Assert
    expect(testContext.router.navigate).toHaveBeenCalledWith(['/user']);
    expect(testContext.snackbarService.error).not.toHaveBeenCalled();
    expect(result).toBeTrue();
  });

  it('should show error snackbar if user is not admin', async () => {
    // Arrange
    testContext.authService.isAdmin.and.returnValue(false);
    
    // Act
    const result = await testContext.component.navigateToUsers();
    
    // Assert
    expect(testContext.router.navigate).not.toHaveBeenCalled();
    expect(testContext.snackbarService.error).toHaveBeenCalledWith(
      '🚫 Access Denied: Only Admins can view User Management.'
    );
    expect(result).toBeFalse();
  });

  it('should have accessible elements with proper ARIA attributes', () => {
    // Get elements with ARIA attributes
    const mainElement = testContext.debugElement.query(By.css('[role="main"]'));
    const buttonElement = testContext.debugElement.query(By.css('button[aria-label]'));
    
    // Assert accessibility attributes are present
    expect(mainElement).toBeTruthy();
    expect(buttonElement.attributes['aria-label']).toBe('Explore User Module');
  });
});
