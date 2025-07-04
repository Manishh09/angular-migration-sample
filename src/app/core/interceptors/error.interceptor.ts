// src/app/core/interceptors/error.interceptor.ts
import { Injectable } from '@angular/core';
import {
  HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService, private router: Router) { }

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401 && error.error?.message === 'Token expired') {
          alert('Session expired. Please log in again.');
          this.authService.logout();
          this.router.navigate(['/login']);
        }
        switch (error.status) {
          case 401:
            this.authService.logout();
            this.router.navigate(['/login']);
            break;

          case 0:
            console.error('Network error');
            break;
          default:
            console.error(`HTTP Error: ${error.status}`, error.message);
        }
        return throwError(() => error);
      })
    );
  }
}
