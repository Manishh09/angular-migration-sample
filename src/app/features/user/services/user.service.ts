import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private dialog: MatDialog) {}

  // Component will be dynamically imported
  // This avoids circular dependency
  openUserDetailsDialog(user: User, component: any): void {
    this.dialog.open(component, {
      width: '750px', // Wider dialog
      maxWidth: '98vw', // Use more of the screen width
      height: 'auto', // Auto height
      maxHeight: '98vh', // Use more of the screen height
      data: user,
      panelClass: 'user-details-dialog',
      autoFocus: false,
      disableClose: false,
      backdropClass: 'user-details-backdrop',
      ariaLabel: 'User Details',
      restoreFocus: true,
      hasBackdrop: true
    });
  }
}
