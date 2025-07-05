import { TestBed } from '@angular/core/testing';
import { ProfileService, UserProfile } from './profile.service';
import { AuthService } from '../../../core/services/auth.service';

describe('ProfileService', () => {
  let service: ProfileService;
  let mockAuthService: jasmine.SpyObj<AuthService>;

  beforeEach(() => {
    mockAuthService = jasmine.createSpyObj('AuthService', ['isAdmin', 'getUserRole']);
    
    TestBed.configureTestingModule({
      providers: [
        ProfileService,
        { provide: AuthService, useValue: mockAuthService }
      ]
    });
    
    service = TestBed.inject(ProfileService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getUserProfile', () => {
    it('should return admin profile when user is admin', (done) => {
      mockAuthService.isAdmin.and.returnValue(true);
      
      service.getUserProfile().subscribe((profile: UserProfile) => {
        expect(profile.firstName).toBe('Admin');
        expect(profile.email).toBe('admin@example.com');
        done();
      });
    });

    it('should return regular user profile when user is not admin', (done) => {
      mockAuthService.isAdmin.and.returnValue(false);
      
      service.getUserProfile().subscribe((profile: UserProfile) => {
        expect(profile.firstName).toBe('User');
        expect(profile.email).toBe('user@example.com');
        done();
      });
    });
  });

  describe('saveUserProfile', () => {
    it('should return success for valid profile data', (done) => {
      const testProfile: UserProfile = {
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        phone: '+1234567890',
        bio: 'Test bio'
      };
      
      service.saveUserProfile(testProfile).subscribe((result: boolean) => {
        expect(result).toBe(true);
        done();
      });
    });
  });
});
