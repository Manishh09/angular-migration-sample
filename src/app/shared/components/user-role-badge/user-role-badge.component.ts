import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-user-role-badge',
  templateUrl: './user-role-badge.component.html',
  styleUrls: ['./user-role-badge.component.scss']
})
export class UserRoleBadgeComponent implements OnInit {
  @Input() role!: string;
  @Input() compact: boolean = false;
  
  badgeColor!: string;
  roleIcon!: string;

  ngOnInit(): void {
    this.setBadgeColor();
    this.setRoleIcon();
  }
  
  /**
   * Returns a descriptive text for the user role to display in tooltip
   */
  getRoleDescription(): string {
    if (!this.role) return 'No role assigned';
    
    switch (this.role.toLowerCase()) {
      case 'admin':
        return 'Administrator with full system access and privileges';
      case 'manager':
        return 'Manager with user management and reporting capabilities';
      case 'user':
        return 'Standard user with basic system access';
      case 'guest':
        return 'Limited access to public resources only';
      default:
        return `Role: ${this.role}`;
    }
  }
  
  private setBadgeColor(): void {
    // Explicitly set the theme colors for clear visual distinction
    switch (this.role?.toLowerCase()) {
      case 'admin':
        this.badgeColor = 'warn'; // Red chip
        break;
      case 'manager':
        this.badgeColor = 'primary'; // Blue chip
        break;
      case 'user':
        this.badgeColor = 'accent'; // Green chip (assuming accent is configured as green)
        break;
      case 'guest':
      default:
        this.badgeColor = ''; // Default chip color - will be handled by CSS
        break;
    }
  }
  
  private setRoleIcon(): void {    switch (this.role?.toLowerCase()) {
      case 'admin':
        this.roleIcon = 'security';
        break;
      case 'manager':
        this.roleIcon = 'supervisor_account';
        break;
      case 'user':
        this.roleIcon = 'person';
        break;
      case 'guest':
        this.roleIcon = 'public';
        break;
      default:
        this.roleIcon = '';
        break;
    }
  }
}
