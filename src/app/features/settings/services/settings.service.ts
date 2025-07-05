import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

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

/**
 * Service responsible for managing user settings
 * Follows the Single Responsibility Principle
 */
@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  
  constructor() { }

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
   * Save user's general settings
   */
  saveGeneralSettings(settings: GeneralSettings): Observable<boolean> {
    // In a real app, this would make an API call
    localStorage.setItem('generalSettings', JSON.stringify(settings));
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
   * Save user's notification settings
   */
  saveNotificationSettings(settings: NotificationSettings): Observable<boolean> {
    // In a real app, this would make an API call
    localStorage.setItem('notificationSettings', JSON.stringify(settings));
    return of(true);
  }

  /**
   * Change user password
   * In a real app, this would call an API endpoint
   */
  changePassword(currentPassword: string, newPassword: string): Observable<boolean> {
    // This would be an API call in a real application
    console.log('Password change requested', { currentPassword, newPassword });
    return of(true);
  }
}
