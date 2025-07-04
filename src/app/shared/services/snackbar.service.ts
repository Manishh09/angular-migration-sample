import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class SnackbarService {
  private defaultConfig: MatSnackBarConfig = {
    duration: 5000,
    horizontalPosition: 'right',
    verticalPosition: 'top'
  };

  constructor(private snackBar: MatSnackBar) {}

  /**
   * Show a success message
   * @param message Message to display
   * @param action Action text (optional)
   * @param config Override default configuration (optional)
   */
  success(message: string, action: string = 'Close', config?: MatSnackBarConfig): void {
    this.show(message, action, {
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
   */
  error(message: string, action: string = 'Close', config?: MatSnackBarConfig): void {
    this.show(message, action, {
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
   */
  warning(message: string, action: string = 'Close', config?: MatSnackBarConfig): void {
    this.show(message, action, {
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
   */
  info(message: string, action: string = 'Close', config?: MatSnackBarConfig): void {
    this.show(message, action, {
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
   */
  private show(message: string, action: string, config: MatSnackBarConfig): void {
    this.snackBar.open(message, action, config);
  }
}
