import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../models/user.model';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-user-create',
  templateUrl: './user-create.component.html',
  styleUrls: ['./user-create.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserCreateComponent {
  constructor(
    private userService: UserService,
    private router: Router
  ) {}

  onSubmit(userData: User): void {
    // In a real app, we would save the user and handle the response
    console.log('Creating user:', userData);
    
    // Navigate back to the user list
    this.router.navigate(['/users']);
  }

  onCancel(): void {
    this.router.navigate(['/users']);
  }
}
