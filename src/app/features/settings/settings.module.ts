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
import { SaveSettingsDialogComponent } from './components/save-settings-dialog/save-settings-dialog.component';
import { UnsavedChangesGuard } from './guards/unsaved-changes.guard';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';

/**
 * Settings Module - Handles all user settings functionality
 * 
 * Features:
 * - General preferences (language, theme, etc.)
 * - Security settings (password management)
 * - Notification preferences
 * - Automatic detection of unsaved changes
 * - Global save functionality
 */
@NgModule({
  declarations: [
    SettingsComponent,
    GeneralSettingsComponent,
    SecuritySettingsComponent,
    NotificationSettingsComponent,
    SaveSettingsDialogComponent,
    ConfirmDialogComponent
  ],
  imports: [
    CommonModule,
    SettingsRoutingModule,
    ReactiveFormsModule,
    MaterialModule,
    SharedModule
  ],
  providers: [
    SettingsService,
    UnsavedChangesGuard
  ]
})
export class SettingsModule { }
