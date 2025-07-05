import { Component, OnInit, OnChanges, SimpleChanges, Output, EventEmitter, Input } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-user-menu',
  templateUrl: './user-menu.component.html',
  styleUrls: ['./user-menu.component.scss'],
  animations: [
    trigger('menuAnimation', [
      state('void', style({
        transform: 'scaleY(0.8)',
        opacity: 0
      })),
      state('open', style({
        transform: 'scaleY(1)',
        opacity: 1
      })),
      transition('void => open', animate('150ms ease-out')),
      transition('open => void', animate('100ms ease-in'))
    ])
  ]
})
export class UserMenuComponent implements OnInit, OnChanges {
  @Output() logout = new EventEmitter<void>();
  @Input() username = '';
  @Input() isLoggingOut = false;
  
  isMenuOpen = false;
  userInitials = '';

  constructor(
    public authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.generateInitials();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['username']) {
      this.generateInitials();
    }
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu(): void {
    this.isMenuOpen = false;
  }

  onLogout(): void {
    // Close menu immediately, then emit logout
    this.isMenuOpen = false;
    setTimeout(() => {
      this.logout.emit();
    }, 0);
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
    this.closeMenu();
  }

  /**
   * Generate user initials from the username
   * If username is "John Doe", returns "JD"
   */
  private generateInitials(): void {
    if (!this.username) {
      this.userInitials = 'U';
      return;
    }

    const nameParts = this.username.split(' ');
    if (nameParts.length === 1) {
      // If single name, use first two letters
      this.userInitials = nameParts[0].substring(0, 2).toUpperCase();
    } else {
      // Use first letter of first and last name
      this.userInitials = (nameParts[0].charAt(0) + nameParts[nameParts.length - 1].charAt(0)).toUpperCase();
    }
  }
}
