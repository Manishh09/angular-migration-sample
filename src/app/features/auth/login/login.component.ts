import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { SnackbarService } from '../../../shared/services/snackbar.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  hidePassword = true;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackbarService: SnackbarService
  ) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(4)]],
      rememberMe: [false]
    });
  }

  ngOnInit(): void {
    // Redirect if already logged in
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/home']);
    }
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      return;
    }

    this.isLoading = true;
    const { username, password } = this.loginForm.value;

    setTimeout(() => {
      const success = this.authService.login(username, password);
      this.isLoading = false;

      if (success) {
        this.snackbarService.success(`Welcome, ${username}! You are now logged in as ${this.authService.getUserRole()}`);
        this.router.navigate(['/home']);
      } else {
        this.snackbarService.error('Login failed. Please check your credentials.');
        this.loginForm.get('password')?.reset();
      }
    }, 1000); // Simulate network delay
  }

  // Helper getter for form controls
  get f() {
    return this.loginForm.controls;
  }
}
