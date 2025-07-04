import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Static roles
  static readonly ROLE_GUEST = 'Guest';
  static readonly ROLE_ADMIN = 'Admin';
  
  // Auth state change subject
  authChange = new Subject<boolean>();
  
  private token: string | null = null;
  private storageTokenKey = 'auth_token';
  private storageRoleKey = 'user_role';

  constructor() {
    // Initialize from localStorage if available
    this.token = localStorage.getItem(this.storageTokenKey);
    // Emit initial auth state
    if (this.token) {
      this.authChange.next(true);
    }
  }

  getToken(): string | null {
    return this.token;
  }

  isLoggedIn(): boolean {
    return !!this.token;
  }

  getUserRole(): 'Admin' | 'Guest' {
    return localStorage.getItem(this.storageRoleKey) as 'Admin' | 'Guest' || AuthService.ROLE_GUEST;
  }

  isAdmin(): boolean {
    return this.getUserRole() === AuthService.ROLE_ADMIN;
  }

  login(username: string, password: string): boolean {
    // mock login logic
    if (username && password) {
      this.token = 'mock-auth-token';
      localStorage.setItem(this.storageTokenKey, this.token);
      
      // For demo purposes: set admin role if username contains 'admin'
      const role = username.toLowerCase().includes('admin') ? 
        AuthService.ROLE_ADMIN : AuthService.ROLE_GUEST;
      localStorage.setItem(this.storageRoleKey, role);
      
      // Notify subscribers that auth state changed
      this.authChange.next(true);
      
      return true;
    }
    return false;
  }

  logout(): void {
    this.token = null;
    localStorage.removeItem(this.storageTokenKey);
    localStorage.removeItem(this.storageRoleKey);
    
    // Notify subscribers that auth state changed
    this.authChange.next(false);
  }
}
