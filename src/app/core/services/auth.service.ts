import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';

/**
 * User role type definition
 */
export type UserRoleType = 'Guest' | 'Admin';

/**
 * Service responsible for authentication-related operations
 */
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Static roles
  static readonly ROLE_GUEST: UserRoleType = 'Guest';
  static readonly ROLE_ADMIN: UserRoleType = 'Admin';
  
  // Auth state change subject - using BehaviorSubject instead of Subject for current value access
  private readonly authChangeSubject = new BehaviorSubject<boolean>(false);
  readonly authChange$: Observable<boolean> = this.authChangeSubject.asObservable();
  
  private token: string | null = null;
  private readonly storageTokenKey = 'auth_token';
  private readonly storageRoleKey = 'user_role';
  private loggingOut = false;

  constructor(private readonly router: Router) {
    // Initialize from localStorage if available
    this.token = localStorage.getItem(this.storageTokenKey);
    // Emit initial auth state
    if (this.token) {
      this.authChangeSubject.next(true);
    }
  }

  /**
   * Returns the current authentication token
   */
  getToken(): string | null {
    return this.token;
  }

  /**
   * Checks if the user is currently logged in
   */
  isLoggedIn(): boolean {
    return Boolean(this.token);
  }

  /**
   * Gets the current user's role from storage
   */
  getUserRole(): UserRoleType {
    const storedRole = localStorage.getItem(this.storageRoleKey);
    // Validate that the stored role is actually a valid UserRoleType
    return (storedRole === AuthService.ROLE_ADMIN || storedRole === AuthService.ROLE_GUEST) 
      ? storedRole 
      : AuthService.ROLE_GUEST;
  }

  /**
   * Checks if the current user has admin role
   */
  isAdmin(): boolean {
    return this.getUserRole() === AuthService.ROLE_ADMIN;
  }

  /**
   * Authenticates a user with username and password
   * @param username - The username to authenticate
   * @param password - The password to authenticate
   * @returns boolean indicating success or failure
   */
  login(username: string, password: string): boolean {
    // Validate inputs
    if (!username || !password) {
      return false;
    }

    // Set token in memory and storage
    this.token = 'mock-auth-token';
    localStorage.setItem(this.storageTokenKey, this.token);
    
    // For demo purposes: set admin role if username contains 'admin'
    const role = username.toLowerCase().includes('admin') 
      ? AuthService.ROLE_ADMIN 
      : AuthService.ROLE_GUEST;
    localStorage.setItem(this.storageRoleKey, role);
    
    // Notify subscribers that auth state changed
    this.authChangeSubject.next(true);
    
    return true;
  }

  /**
   * Logs out the current user
   * @returns Promise resolving to boolean indicating success
   */
  logout(): Promise<boolean> {
    // Prevent concurrent logout attempts
    if (this.loggingOut) {
      return Promise.resolve(false);
    }
    
    this.loggingOut = true;
    
    try {
      // Clear auth data immediately
      this.token = null;
      localStorage.removeItem(this.storageTokenKey);
      localStorage.removeItem(this.storageRoleKey);
      
      // Notify subscribers that auth state changed
      this.authChangeSubject.next(false);
      
      return Promise.resolve(true);
    } finally {
      // Always reset the loggingOut flag
      this.loggingOut = false;
    }
  }
}
