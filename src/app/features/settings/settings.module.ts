import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../material/material.module';
import { SettingsRoutingModule } from './settings-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { GeneralSettingsComponent } from './general-settings/general-settings.component';
import { SecuritySettingsComponent } from './security-settings/security-settings.component';
import { NotificationSettingsComponent } from './notification-settings/notification-settings.component';
import { SettingsComponent } from './settings.component';

@NgModule({
  declarations: [
    SettingsComponent,
    GeneralSettingsComponent,
    SecuritySettingsComponent,
    NotificationSettingsComponent
  ],
  imports: [
    CommonModule,
    SettingsRoutingModule,
    ReactiveFormsModule,
    MaterialModule,
    SharedModule
  ]
})
export class SettingsModule { }
