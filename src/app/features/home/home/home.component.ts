import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { SnackbarService } from '../../../shared/services/snackbar.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(
    private authService: AuthService,
    private router: Router,
    private snackbarService: SnackbarService
  ) { }

  ngOnInit(): void {
  }

  navigateToUsers(): void {
    if (this.authService.isAdmin()) {
      this.router.navigate(['/user']);
    } else {
      this.snackbarService.error('🚫 Access Denied: Only Admins can view User Management.');
    }
  }
}
