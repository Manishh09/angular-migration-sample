import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';
import { SnackbarService } from '../../../shared/services/snackbar.service';

interface LoginForm {
  username: string;
  password: string;
  rememberMe: boolean;
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  hidePassword = true;
  private loadingSubject = new BehaviorSubject<boolean>(false);
  readonly isLoading$ = this.loadingSubject.asObservable();

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackbarService: SnackbarService
  ) {
    this.loginForm = this.fb.group({
      username: new FormControl('', { validators: [Validators.required], nonNullable: true }),
      password: new FormControl('', { validators: [Validators.required, Validators.minLength(4)], nonNullable: true }),
      rememberMe: new FormControl(false, { nonNullable: true })
    });
  }

  ngOnInit(): void {
    // Only redirect if already logged in
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/home']);
    }
    
    // Pre-fill test credentials for faster testing
    this.loginForm.patchValue({
      username: 'test',
      password: 'password'
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      return;
    }

    this.loadingSubject.next(true);
    const { username, password } = this.loginForm.value as LoginForm;

    setTimeout(() => {
      const success = this.authService.login(username, password);
      this.loadingSubject.next(false);

      if (success) {
        this.snackbarService.success(`Welcome, ${username}! You are now logged in as ${this.authService.getUserRole()}`);
        this.router.navigate(['/home']);
      } else {
        this.snackbarService.error('Login failed. Please check your credentials.');
        this.loginForm.get('password')?.reset();
      }
    }, 1000); // Simulate network delay
  }
}
