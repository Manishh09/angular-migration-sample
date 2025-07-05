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
          // We'll handle this in the 401 case below
        }
        switch (error.status) {
          case 401:
            // First logout, then navigate
            this.authService.logout().then(() => {
              this.router.navigate(['/auth/login']);
            });
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
