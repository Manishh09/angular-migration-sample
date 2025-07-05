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
import { SettingsService } from './services/settings.service';

/**
 * Settings Module - Handles all user settings functionality
 * 
 * Features:
 * - General preferences (language, theme, etc.)
 * - Security settings (password management)
 * - Notification preferences
 */
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
  ],
  providers: [
    // Service is provided in root, this is just for documentation
    // SettingsService
  ]
})
export class SettingsModule { }
