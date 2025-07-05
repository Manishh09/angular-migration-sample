import { Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ComponentType } from '@angular/cdk/portal';
import { User } from '../models/user.model';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private users: User[] = [
    { id: 1, name: 'John Doe', email: 'john.doe@example.com', role: 'Admin', phone: '123-456-7890', address: '123 Main St, City', joinDate: new Date(2023, 0, 15) },
    { id: 2, name: 'Jane Smith', email: 'jane.smith@example.com', role: 'User', phone: '987-654-3210', address: '456 Oak Ave, Town', joinDate: new Date(2023, 1, 20) },
    { id: 3, name: 'Robert Johnson', email: 'robert.j@example.com', role: 'Manager', phone: '555-123-4567', address: '789 Pine Rd, Village', joinDate: new Date(2023, 2, 10) },
    { id: 4, name: 'Emily Davis', email: 'emily.d@example.com', role: 'User', phone: '222-333-4444', address: '101 Elm St, County', joinDate: new Date(2023, 3, 5) },
    { id: 5, name: 'Michael Brown', email: 'michael.b@example.com', role: 'Manager', phone: '777-888-9999', address: '202 Cedar Ln, District', joinDate: new Date(2023, 4, 25) },
    { id: 6, name: 'Sarah Wilson', email: 'sarah.w@example.com', role: 'User', phone: '444-555-6666', address: '303 Birch Dr, Province', joinDate: new Date(2023, 5, 30) },
    { id: 7, name: 'David Taylor', email: 'david.t@example.com', role: 'Admin', phone: '111-222-3333', address: '404 Maple Ave, State', joinDate: new Date(2023, 6, 12) },
    { id: 8, name: 'Lisa Anderson', email: 'lisa.a@example.com', role: 'User', phone: '666-777-8888', address: '505 Willow St, Territory', joinDate: new Date(2023, 7, 8) },
  ];

  constructor(private dialog: MatDialog) {}

  // Get all users
  getUsers(): Observable<User[]> {
    return of(this.users);
  }

  // Get user by id
  getUserById(id: number): Observable<User | undefined> {
    return of(this.users.find(user => user.id === id));
  }

  // Component will be dynamically imported
  // This avoids circular dependency
  openUserDetailsDialog(user: User, component: ComponentType<unknown>): void {
    this.dialog.open(component, {
      width: '750px',
      maxWidth: '98vw',
      height: 'auto',
      maxHeight: '98vh',
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
