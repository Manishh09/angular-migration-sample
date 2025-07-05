import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { DashboardStats, AdminSettings } from '../models/dashboard-stats.model';

/**
 * Service responsible for admin-related functionality
 */
@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor() { }

  /**
   * Retrieves dashboard statistics
   * @returns Observable with dashboard statistics
   */
  getDashboardStats(): Observable<DashboardStats> {
    // Mock data - in a real app, this would come from an API
    const mockStats: DashboardStats = {
      totalUsers: 1254,
      activeSessions: 87,
      errorsToday: 12
    };

    // Simulate network delay
    return of(mockStats).pipe(delay(800));
  }

  /**
   * Saves admin settings
   * @param settings The settings to save
   * @returns Observable with the operation result
   */
  saveSettings(settings: AdminSettings): Observable<{success: boolean, message: string}> {
    // Mock API call - in a real app, this would be an HTTP request
    console.log('Saving admin settings:', settings);
    
    // Simulate network delay and success response
    return of({ success: true, message: 'Settings saved successfully' }).pipe(delay(1500));
  }
}
