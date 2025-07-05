import { TestBed } from '@angular/core/testing';
import { SettingsService, DEFAULT_GENERAL_SETTINGS, DEFAULT_NOTIFICATION_SETTINGS } from './settings.service';

describe('SettingsService', () => {
  let service: SettingsService;
  
  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SettingsService);
    
    // Clear localStorage before each test
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return default general settings when none are saved', (done) => {
    service.getGeneralSettings().subscribe(settings => {
      expect(settings).toEqual(DEFAULT_GENERAL_SETTINGS);
      done();
    });
  });

  it('should return saved general settings', (done) => {
    const testSettings = {
      language: 'spanish',
      timezone: 'EST',
      dateFormat: 'DD/MM/YYYY',
      theme: 'dark'
    };
    
    localStorage.setItem('generalSettings', JSON.stringify(testSettings));
    
    service.getGeneralSettings().subscribe(settings => {
      expect(settings).toEqual(testSettings);
      done();
    });
  });

  it('should save general settings to localStorage', (done) => {
    const testSettings = {
      language: 'french',
      timezone: 'PST',
      dateFormat: 'YYYY-MM-DD',
      theme: 'system'
    };
    
    service.saveGeneralSettings(testSettings).subscribe(success => {
      expect(success).toBeTrue();
      const savedSettings = JSON.parse(localStorage.getItem('generalSettings') || '{}');
      expect(savedSettings).toEqual(testSettings);
      done();
    });
  });

  it('should return default notification settings when none are saved', (done) => {
    service.getNotificationSettings().subscribe(settings => {
      expect(settings).toEqual(DEFAULT_NOTIFICATION_SETTINGS);
      done();
    });
  });

  it('should return saved notification settings', (done) => {
    const testSettings = {
      emailNotifications: false,
      pushNotifications: false,
      marketingEmails: true,
      activitySummary: false
    };
    
    localStorage.setItem('notificationSettings', JSON.stringify(testSettings));
    
    service.getNotificationSettings().subscribe(settings => {
      expect(settings).toEqual(testSettings);
      done();
    });
  });

  it('should save notification settings to localStorage', (done) => {
    const testSettings = {
      emailNotifications: false,
      pushNotifications: true,
      marketingEmails: true,
      activitySummary: false
    };
    
    service.saveNotificationSettings(testSettings).subscribe(success => {
      expect(success).toBeTrue();
      const savedSettings = JSON.parse(localStorage.getItem('notificationSettings') || '{}');
      expect(savedSettings).toEqual(testSettings);
      done();
    });
  });

  it('should return true when changing password', (done) => {
    service.changePassword('oldPassword', 'newPassword').subscribe(success => {
      expect(success).toBeTrue();
      done();
    });
  });
});
