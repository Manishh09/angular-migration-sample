import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { User } from '../models/user.model';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['name', 'email', 'role', 'actions'];
  dataSource: MatTableDataSource<User>;
  users: User[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private userService: UserService) {
    // Mock data for demonstration
    this.users = [
      { id: 1, name: 'John Doe', email: 'john.doe@example.com', role: 'Admin', phone: '123-456-7890', address: '123 Main St, City', joinDate: new Date(2023, 0, 15) },
      { id: 2, name: 'Jane Smith', email: 'jane.smith@example.com', role: 'User', phone: '987-654-3210', address: '456 Oak Ave, Town', joinDate: new Date(2023, 1, 20) },
      { id: 3, name: 'Robert Johnson', email: 'robert.j@example.com', role: 'Manager', phone: '555-123-4567', address: '789 Pine Rd, Village', joinDate: new Date(2023, 2, 10) },
      { id: 4, name: 'Emily Davis', email: 'emily.d@example.com', role: 'User', phone: '222-333-4444', address: '101 Elm St, County', joinDate: new Date(2023, 3, 5) },
      { id: 5, name: 'Michael Brown', email: 'michael.b@example.com', role: 'Manager', phone: '777-888-9999', address: '202 Cedar Ln, District', joinDate: new Date(2023, 4, 25) },
      { id: 6, name: 'Sarah Wilson', email: 'sarah.w@example.com', role: 'User', phone: '444-555-6666', address: '303 Birch Dr, Province', joinDate: new Date(2023, 5, 30) },
      { id: 7, name: 'David Taylor', email: 'david.t@example.com', role: 'Admin', phone: '111-222-3333', address: '404 Maple Ave, State', joinDate: new Date(2023, 6, 12) },
      { id: 8, name: 'Lisa Anderson', email: 'lisa.a@example.com', role: 'User', phone: '666-777-8888', address: '505 Willow St, Territory', joinDate: new Date(2023, 7, 8) },
    ];
    
    this.dataSource = new MatTableDataSource(this.users);
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  openUserDetails(user: User): void {
    // We'll need to dynamically import the UserDetailsComponent to avoid circular dependency
    import('../user-details/user-details.component').then(({ UserDetailsComponent }) => {
      this.userService.openUserDetailsDialog(user, UserDetailsComponent);
    });
  }
}
