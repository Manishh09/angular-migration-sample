import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { ChangeDetectionStrategy } from '@angular/core';
import { SettingsService, SettingsPendingChanges } from './services/settings.service';
import { Subject, Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { SaveSettingsDialogComponent } from './components/save-settings-dialog/save-settings-dialog.component';
import { SnackbarService } from '../../shared/services/snackbar.service';
import { ComponentCanDeactivate } from './guards/unsaved-changes.guard';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SettingsComponent implements OnInit, OnDestroy, ComponentCanDeactivate {
  selectedTab = 0;
  hasPendingChanges = false;
  savingInProgress = false;
  private destroy$ = new Subject<void>();
  
  // Track pending changes for each settings section
  pendingChanges: SettingsPendingChanges = {
    general: false,
    notifications: false,
    security: false
  };
  
  constructor(
    public authService: AuthService,
    private settingsService: SettingsService,
    private dialog: MatDialog,
    private snackbarService: SnackbarService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    // Subscribe to pending changes
    this.settingsService.hasPendingChanges$
      .pipe(takeUntil(this.destroy$))
      .subscribe((changes: SettingsPendingChanges) => {
        this.pendingChanges = changes;
        this.hasPendingChanges = Object.values(changes).some(Boolean);
        this.cdr.markForCheck();
      });
      
    // Subscribe to saving status
    this.settingsService.savingStatus$
      .pipe(takeUntil(this.destroy$))
      .subscribe((isSaving: boolean) => {
        this.savingInProgress = isSaving;
        this.cdr.markForCheck();
      });
  }
  
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onTabChange(event: number): void {
    console.log('Tab change requested, has pending changes:', this.hasPendingChanges);
    console.log('Current tab:', this.selectedTab, 'Requested tab:', event);
    console.log('Changed sections:', this.settingsService.getChangedSections());
    
    // Avoid running this logic when the same tab is selected
    if (this.selectedTab === event) {
      return;
    }
    
    // If there are unsaved changes, show confirmation dialog before tab change
    if (this.hasPendingChanges) {
      const previousTab = this.selectedTab;
      
      // Store the requested tab index temporarily
      const requestedTab = event;
      
      // Refresh changed sections
      const changedSections: ReadonlyArray<string> = this.settingsService.getChangedSections();
      console.log('Changed sections for dialog:', changedSections);
      
      // Open confirmation dialog
      const dialogRef: MatDialogRef<SaveSettingsDialogComponent, boolean> = this.dialog.open(SaveSettingsDialogComponent, {
        width: '400px',
        disableClose: true, // Prevent closing by clicking outside
        data: { changedSections }
      });
      
      dialogRef.afterClosed().subscribe((result: boolean | undefined) => {
        if (result === true) {
          // Save changes and then switch tabs
          this.settingsService.saveAllSettings()
            .pipe(takeUntil(this.destroy$))
            .subscribe((success: boolean) => {
              if (success) {
                this.selectedTab = requestedTab;
                this.snackbarService.success('All settings saved successfully');
                this.cdr.markForCheck();
              } else {
                this.snackbarService.error('Failed to save settings');
              }
            });
        } else {
          // Discard changes and switch tabs
          this.selectedTab = requestedTab;
          this.cdr.markForCheck();
        }
      });
    } else {
      // If no pending changes, just switch tabs
      this.selectedTab = event;
    }
  }
  
  openSaveConfirmationDialog(): void {
    const changedSections: ReadonlyArray<string> = this.settingsService.getChangedSections();
    
    const dialogRef: MatDialogRef<SaveSettingsDialogComponent, boolean> = this.dialog.open(SaveSettingsDialogComponent, {
      width: '400px',
      data: { changedSections }
    });
    
    dialogRef.afterClosed().subscribe((result: boolean | undefined) => {
      if (result === true) {
        this.saveAllSettings();
      }
    });
  }
  
  saveAllSettings(): void {
    this.settingsService.saveAllSettings()
      .pipe(takeUntil(this.destroy$))
      .subscribe((success: boolean) => {
        if (success) {
          this.snackbarService.success('All settings saved successfully');
        } else {
          this.snackbarService.error('Failed to save settings');
        }
      });
  }
  
  /**
   * Implementation for the CanDeactivate guard
   */
  canDeactivate(): boolean | Observable<boolean> {
    return !this.hasPendingChanges;
  }
}
