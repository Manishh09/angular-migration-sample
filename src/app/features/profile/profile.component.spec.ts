import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ProfileComponent } from './profile.component';
import { MaterialModule } from '../../material/material.module';
import { AuthService } from '../../core/services/auth.service';
import { SnackbarService } from '../../shared/services/snackbar.service';
import { ProfileService, UserProfile } from './services/profile.service';
import { of, throwError } from 'rxjs';

describe('ProfileComponent', () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockSnackbarService: jasmine.SpyObj<SnackbarService>;
  let mockProfileService: jasmine.SpyObj<ProfileService>;

  const mockUserProfile: UserProfile = {
    firstName: 'Test',
    lastName: 'User',
    email: 'test@example.com',
    phone: '+1234567890',
    bio: 'Test bio'
  };

  beforeEach(async () => {
    mockAuthService = jasmine.createSpyObj('AuthService', ['isAdmin', 'getUserRole']);
    mockSnackbarService = jasmine.createSpyObj('SnackbarService', ['success', 'error']);
    mockProfileService = jasmine.createSpyObj('ProfileService', ['getUserProfile', 'saveUserProfile']);

    // Configure mock return values
    mockAuthService.isAdmin.and.returnValue(false);
    mockAuthService.getUserRole.and.returnValue('Guest');
    mockSnackbarService.success.and.returnValue(of(undefined));
    mockSnackbarService.error.and.returnValue(of(undefined));
    mockProfileService.getUserProfile.and.returnValue(of(mockUserProfile));
    mockProfileService.saveUserProfile.and.returnValue(of(true));

    await TestBed.configureTestingModule({
      declarations: [ProfileComponent],
      imports: [
        ReactiveFormsModule,
        MaterialModule,
        NoopAnimationsModule
      ],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: SnackbarService, useValue: mockSnackbarService },
        { provide: ProfileService, useValue: mockProfileService }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load user profile on init', () => {
    expect(mockProfileService.getUserProfile).toHaveBeenCalled();
    expect(component.profileForm.get('firstName')?.value).toBe(mockUserProfile.firstName);
    expect(component.profileForm.get('lastName')?.value).toBe(mockUserProfile.lastName);
    expect(component.profileForm.get('email')?.value).toBe(mockUserProfile.email);
  });

  it('should start with disabled form', () => {
    expect(component.profileForm.disabled).toBeTrue();
  });

  it('should toggle edit mode', () => {
    // Initially disabled
    expect(component.isEditing).toBeFalse();
    expect(component.profileForm.disabled).toBeTrue();
    
    // Enable edit mode
    component.toggleEditMode();
    expect(component.isEditing).toBeTrue();
    expect(component.profileForm.enabled).toBeTrue();
    
    // Disable edit mode
    component.toggleEditMode();
    expect(component.isEditing).toBeFalse();
    expect(component.profileForm.disabled).toBeTrue();
  });

  it('should save profile when form is valid', fakeAsync(() => {
    // Enable edit mode
    component.toggleEditMode();
    
    // Update form values
    component.profileForm.patchValue({
      firstName: 'Updated',
      lastName: 'Name',
      email: 'updated@example.com',
      phone: '+9876543210',
      bio: 'Updated bio'
    });
    
    // Save profile
    component.saveProfile();
    tick(1000);
    
    // Verify save was called with updated values
    expect(mockProfileService.saveUserProfile).toHaveBeenCalledWith({
      firstName: 'Updated',
      lastName: 'Name',
      email: 'updated@example.com',
      phone: '+9876543210',
      bio: 'Updated bio'
    });
    
    // Verify notification was shown
    expect(mockSnackbarService.success).toHaveBeenCalledWith('Profile updated successfully!');
    
    // Verify form was disabled after save
    expect(component.isEditing).toBeFalse();
    expect(component.profileForm.disabled).toBeTrue();
  }));

  it('should not save profile when form is invalid', () => {
    // Enable edit mode
    component.toggleEditMode();
    
    // Make form invalid
    component.profileForm.patchValue({
      firstName: '',
      email: 'invalid-email'
    });
    
    // Try to save profile
    component.saveProfile();
    
    // Verify save was not called
    expect(mockProfileService.saveUserProfile).not.toHaveBeenCalled();
  });

  it('should show error notification when profile load fails', fakeAsync(() => {
    // Reset and setup error scenario
    mockProfileService.getUserProfile.calls.reset();
    mockProfileService.getUserProfile.and.returnValue(throwError(() => new Error('Network error')));
    
    // Trigger profile load
    component.ngOnInit();
    tick(300);
    
    // Verify error notification
    expect(mockSnackbarService.error).toHaveBeenCalledWith('Failed to load profile data. Please refresh the page.');
  }));

  it('should cancel edit and reload profile', () => {
    // Enable edit mode
    component.toggleEditMode();
    
    // Update form values
    component.profileForm.patchValue({
      firstName: 'Changed',
      lastName: 'Value'
    });
    
    // Cancel edit
    component.cancelEdit();
    
    // Verify profile was reloaded
    expect(mockProfileService.getUserProfile).toHaveBeenCalled();
    
    // Verify edit mode was disabled
    expect(component.isEditing).toBeFalse();
    expect(component.profileForm.disabled).toBeTrue();
  });

  it('should generate user initials correctly', () => {
    // Test with first and last name
    component.profileForm.patchValue({
      firstName: 'John',
      lastName: 'Doe'
    });
    
    // Access private method via any cast
    (component as any).generateUserInitials();
    
    expect(component.userInitials).toBe('JD');
    
    // Test with only first name
    component.profileForm.patchValue({
      firstName: 'Alice',
      lastName: ''
    });
    
    (component as any).generateUserInitials();
    
    expect(component.userInitials).toBe('AL');
    
    // Test with no name
    component.profileForm.patchValue({
      firstName: '',
      lastName: ''
    });
    
    (component as any).generateUserInitials();
    
    expect(component.userInitials).toBe('U');
  });
});
