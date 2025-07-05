import { Injectable } from '@angular/core';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

/**
 * Interface representing the pending changes state for each settings section
 */
export interface SettingsPendingChanges {
  general: boolean;
  notifications: boolean;
  security: boolean;
}

/**
 * Interface for General Settings
 */
export interface GeneralSettings {
  language: string;
  timezone: string;
  dateFormat: string;
  theme: string;
}

/**
 * Interface for Notification Settings
 */
export interface NotificationSettings {
  emailNotifications: boolean;
  pushNotifications: boolean;
  marketingEmails: boolean;
  activitySummary: boolean;
}

/**
 * Interface for Security Settings
 */
export interface SecuritySettings {
  twoFactorEnabled?: boolean;
  lastPasswordChange?: string;
  sessionTimeout?: number;
  pendingPasswordChange?: boolean;
}

/**
 * Combined settings interface
 */
export interface UserSettings {
  general: GeneralSettings;
  notifications: NotificationSettings;
  security: SecuritySettings;
}

/**
 * Default values for settings
 */
export const DEFAULT_GENERAL_SETTINGS: GeneralSettings = {
  language: 'english',
  timezone: 'UTC',
  dateFormat: 'MM/DD/YYYY',
  theme: 'light'
};

export const DEFAULT_NOTIFICATION_SETTINGS: NotificationSettings = {
  emailNotifications: true,
  pushNotifications: true,
  marketingEmails: false,
  activitySummary: true
};

export const DEFAULT_SECURITY_SETTINGS: SecuritySettings = {
  twoFactorEnabled: false,
  lastPasswordChange: new Date().toISOString(),
  sessionTimeout: 30,
  pendingPasswordChange: false
};

/**
 * Service responsible for managing user settings
 * Follows the Single Responsibility Principle
 */
@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  private initialSettings: UserSettings | null = null;
  private currentSettings: UserSettings | null = null;
  
  // Tracks whether any settings section has pending changes
  private hasPendingChangesSubject = new BehaviorSubject<SettingsPendingChanges>({
    general: false,
    notifications: false,
    security: false
  });
  
  // Publicly observable state of pending changes
  public hasPendingChanges$: Observable<SettingsPendingChanges> = this.hasPendingChangesSubject.asObservable();
  
  // BehaviorSubject for tracking saving status
  private savingStatusSubject = new BehaviorSubject<boolean>(false);
  public savingStatus$ = this.savingStatusSubject.asObservable();
  
  constructor() {
    // Load initial settings
    this.loadAllSettings().subscribe(settings => {
      this.initialSettings = JSON.parse(JSON.stringify(settings)); // Deep copy
      this.currentSettings = settings;
    });
  }
  
  /**
   * Get combined user settings
   */
  loadAllSettings(): Observable<UserSettings> {
    const generalSettings = localStorage.getItem('generalSettings');
    const notificationSettings = localStorage.getItem('notificationSettings');
    const securitySettings = localStorage.getItem('securitySettings');
    
    const settings: UserSettings = {
      general: generalSettings ? JSON.parse(generalSettings) : DEFAULT_GENERAL_SETTINGS,
      notifications: notificationSettings ? JSON.parse(notificationSettings) : DEFAULT_NOTIFICATION_SETTINGS,
      security: securitySettings ? JSON.parse(securitySettings) : DEFAULT_SECURITY_SETTINGS
    };
    
    return of(settings);
  }
  
  /**
   * Save all user settings at once
   */
  saveAllSettings(): Observable<boolean> {
    if (!this.currentSettings) {
      return of(false);
    }
    
    this.savingStatusSubject.next(true);
    
    // Simulate API call with a delay
    return of(true).pipe(
      map(() => {
        // In a real app, this would be an API call
        localStorage.setItem('generalSettings', JSON.stringify(this.currentSettings?.general));
        localStorage.setItem('notificationSettings', JSON.stringify(this.currentSettings?.notifications));
        localStorage.setItem('securitySettings', JSON.stringify(this.currentSettings?.security));
        
        // Update initial settings to match current settings after save
        this.initialSettings = JSON.parse(JSON.stringify(this.currentSettings));
        
        // Reset pending changes
        this.hasPendingChangesSubject.next({
          general: false,
          notifications: false,
          security: false
        });
        
        this.savingStatusSubject.next(false);
        return true;
      })
    );
  }
  
  /**
   * Check which sections have pending changes
   * @returns An array of section names that have pending changes
   */
  getChangedSections(): ReadonlyArray<string> {
    const changedSections: string[] = [];
    const pendingChanges = this.hasPendingChangesSubject.getValue();
    
    if (pendingChanges.general) changedSections.push('General Settings');
    if (pendingChanges.notifications) changedSections.push('Notification Settings');
    if (pendingChanges.security) changedSections.push('Security Settings');
    
    return changedSections;
  }
  
  /**
   * Check if any settings have been changed
   * @returns True if any section has pending changes
   */
  hasAnyChanges(): boolean {
    const pendingChanges = this.hasPendingChangesSubject.getValue();
    return Object.values(pendingChanges).some(Boolean);
  }

  /**
   * Get user's general settings
   * In a real app, this would fetch from API
   */
  getGeneralSettings(): Observable<GeneralSettings> {
    // In a real app, this would make an API call
    // For now, return defaults from localStorage or defaults
    const savedSettings = localStorage.getItem('generalSettings');
    return of(savedSettings ? JSON.parse(savedSettings) : DEFAULT_GENERAL_SETTINGS);
  }

  /**
   * Update general settings in memory (doesn't save to backend)
   */
  updateGeneralSettings(settings: GeneralSettings): void {
    if (!this.currentSettings) return;
    
    this.currentSettings.general = settings;
    
    // Check if settings have changed from initial
    const hasChanges = JSON.stringify(this.initialSettings?.general) !== JSON.stringify(settings);
    
    // Update pending changes
    const currentChanges = this.hasPendingChangesSubject.getValue();
    this.hasPendingChangesSubject.next({
      ...currentChanges,
      general: hasChanges
    });
  }

  /**
   * Save user's general settings
   */
  saveGeneralSettings(settings: GeneralSettings): Observable<boolean> {
    // Update in-memory settings
    this.updateGeneralSettings(settings);
    
    // In a real app, this would make an API call
    localStorage.setItem('generalSettings', JSON.stringify(settings));
    
    // After successful save, update initial settings
    if (this.initialSettings) {
      this.initialSettings.general = JSON.parse(JSON.stringify(settings));
    }
    
    // Reset pending changes for general
    const currentChanges = this.hasPendingChangesSubject.getValue();
    this.hasPendingChangesSubject.next({
      ...currentChanges,
      general: false
    });
    
    return of(true);
  }

  /**
   * Get user's notification settings
   */
  getNotificationSettings(): Observable<NotificationSettings> {
    // In a real app, this would make an API call
    const savedSettings = localStorage.getItem('notificationSettings');
    return of(savedSettings ? JSON.parse(savedSettings) : DEFAULT_NOTIFICATION_SETTINGS);
  }

  /**
   * Update notification settings in memory (doesn't save to backend)
   */
  updateNotificationSettings(settings: NotificationSettings): void {
    if (!this.currentSettings) return;
    
    this.currentSettings.notifications = settings;
    
    // Check if settings have changed from initial
    const hasChanges = JSON.stringify(this.initialSettings?.notifications) !== JSON.stringify(settings);
    
    // Update pending changes
    const currentChanges = this.hasPendingChangesSubject.getValue();
    this.hasPendingChangesSubject.next({
      ...currentChanges,
      notifications: hasChanges
    });
  }

  /**
   * Save user's notification settings
   */
  saveNotificationSettings(settings: NotificationSettings): Observable<boolean> {
    // Update in-memory settings
    this.updateNotificationSettings(settings);
    
    // In a real app, this would make an API call
    localStorage.setItem('notificationSettings', JSON.stringify(settings));
    
    // After successful save, update initial settings
    if (this.initialSettings) {
      this.initialSettings.notifications = JSON.parse(JSON.stringify(settings));
    }
    
    // Reset pending changes for notifications
    const currentChanges = this.hasPendingChangesSubject.getValue();
    this.hasPendingChangesSubject.next({
      ...currentChanges,
      notifications: false
    });
    
    return of(true);
  }
  
  /**
   * Get security settings
   */
  getSecuritySettings(): Observable<SecuritySettings> {
    const savedSettings = localStorage.getItem('securitySettings');
    return of(savedSettings ? JSON.parse(savedSettings) : DEFAULT_SECURITY_SETTINGS);
  }
  
  /**
   * Get current security settings synchronously (for immediate use)
   */
  getCurrentSecuritySettings(): SecuritySettings {
    if (this.currentSettings?.security) {
      return this.currentSettings.security;
    }
    
    const savedSettings = localStorage.getItem('securitySettings');
    return savedSettings ? JSON.parse(savedSettings) : DEFAULT_SECURITY_SETTINGS;
  }
  
  /**
   * Update security settings in memory (doesn't save to backend)
   * @param settings The updated security settings
   */
  updateSecuritySettings(settings: SecuritySettings): void {
    if (!this.currentSettings) return;

    this.currentSettings.security = settings;

    // For security settings, directly use the pendingPasswordChange flag
    // because password comparison can be tricky with hashed passwords
    const hasChanges: boolean = Boolean(settings.pendingPasswordChange);
    
    console.log('Security settings updated, has changes:', hasChanges);
    
    // Update pending changes
    const currentChanges: SettingsPendingChanges = this.hasPendingChangesSubject.getValue();
    this.hasPendingChangesSubject.next({
      ...currentChanges,
      security: hasChanges
    });
  }

  /**
   * Change user password
   * In a real app, this would call an API endpoint
   */
  changePassword(currentPassword: string, newPassword: string): Observable<boolean> {
    // This would be an API call in a real application
    console.log('Password change requested', { currentPassword, newPassword });
    
    if (this.currentSettings && this.initialSettings) {
      // Update settings
      this.currentSettings.security.lastPasswordChange = new Date().toISOString();
      this.currentSettings.security.pendingPasswordChange = false;
      
      // Update initial settings to match
      this.initialSettings.security = JSON.parse(JSON.stringify(this.currentSettings.security));
      
      // Save to localStorage
      localStorage.setItem('securitySettings', JSON.stringify(this.currentSettings.security));
      
      // Reset pending changes for security
      const currentChanges = this.hasPendingChangesSubject.getValue();
      this.hasPendingChangesSubject.next({
        ...currentChanges,
        security: false
      });
    }
    
    return of(true);
  }
}
