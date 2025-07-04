import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserRoutingModule } from './user-routing.module';
import { UserListComponent } from './user-list/user-list.component';
import { UserDetailsComponent } from './user-details/user-details.component';
import { MaterialModule } from '../../material/material.module';
import { UserService } from './services/user.service';

@NgModule({
  declarations: [
    UserListComponent,
    UserDetailsComponent
  ],
  imports: [
    CommonModule,
    UserRoutingModule,
    MaterialModule
  ],
  providers: [UserService]
})
export class UserModule { }
