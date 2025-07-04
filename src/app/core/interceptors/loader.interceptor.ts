// src/app/core/interceptors/loader.interceptor.ts
import { Injectable } from '@angular/core';
import {
  HttpEvent, HttpInterceptor, HttpHandler, HttpRequest
} from '@angular/common/http';
import { finalize, Observable } from 'rxjs';
import { LoaderService } from '../services/loader.service';

@Injectable()
export class LoaderInterceptor implements HttpInterceptor {
  constructor(private loaderService: LoaderService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.loaderService.showLoading();
    return next.handle(req).pipe(
      // Hide the loader when the request completes
      // regardless of the outcome (success or error)
      finalize(
        () => this.loaderService.hideLoading() 
      )
    );
  }
}
