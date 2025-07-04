import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { User } from '../models/user.model';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss']
})
export class UserDetailsComponent {
  constructor(
    public dialogRef: MatDialogRef<UserDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public user: User
  ) {}

  closeDialog(): void {
    this.dialogRef.close();
  }
}
