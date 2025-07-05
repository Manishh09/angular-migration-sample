import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig, MatSnackBarRef, TextOnlySnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SnackbarService {
  private defaultConfig: MatSnackBarConfig = {
    duration: 3000,
    horizontalPosition: 'right',
    verticalPosition: 'bottom'
  };

  constructor(private snackBar: MatSnackBar) {}

  /**
   * Show a success message
   * @param message Message to display
   * @param action Action text (optional)
   * @param config Override default configuration (optional)
   * @returns Observable that completes when the snackbar is dismissed
   */
  success(message: string, action: string = 'Close', config?: MatSnackBarConfig): Observable<void> {
    return this.show(message, action, {
      ...this.defaultConfig,
      panelClass: ['success-snackbar'],
      ...config
    });
  }

  /**
   * Show an error message
   * @param message Message to display
   * @param action Action text (optional)
   * @param config Override default configuration (optional)
   * @returns Observable that completes when the snackbar is dismissed
   */
  error(message: string, action: string = 'Close', config?: MatSnackBarConfig): Observable<void> {
    return this.show(message, action, {
      ...this.defaultConfig,
      panelClass: ['error-snackbar'],
      ...config
    });
  }

  /**
   * Show a warning message
   * @param message Message to display
   * @param action Action text (optional)
   * @param config Override default configuration (optional)
   * @returns Observable that completes when the snackbar is dismissed
   */
  warning(message: string, action: string = 'Close', config?: MatSnackBarConfig): Observable<void> {
    return this.show(message, action, {
      ...this.defaultConfig,
      panelClass: ['warning-snackbar'],
      ...config
    });
  }

  /**
   * Show an info message
   * @param message Message to display
   * @param action Action text (optional)
   * @param config Override default configuration (optional)
   * @returns Observable that completes when the snackbar is dismissed
   */
  info(message: string, action: string = 'Close', config?: MatSnackBarConfig): Observable<void> {
    return this.show(message, action, {
      ...this.defaultConfig,
      panelClass: ['info-snackbar'],
      ...config
    });
  }

  /**
   * Show a custom snackbar message with provided configuration
   * @param message Message to display
   * @param action Action text
   * @param config Snackbar configuration
   * @returns Observable that completes when the snackbar is dismissed
   */
  private show(message: string, action: string, config: MatSnackBarConfig): Observable<void> {
    const snackBarRef = this.snackBar.open(message, action, config);
    return new Observable<void>(observer => {
      snackBarRef.afterDismissed().subscribe(() => {
        observer.next();
        observer.complete();
      });
    });
  }
}
