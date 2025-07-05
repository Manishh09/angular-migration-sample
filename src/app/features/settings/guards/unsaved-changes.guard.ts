import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { map } from 'rxjs/operators';
import { ConfirmDialogComponent } from '../components/confirm-dialog/confirm-dialog.component';

export interface ComponentCanDeactivate {
  canDeactivate: () => boolean | Observable<boolean>;
}

@Injectable({
  providedIn: 'root'
})
export class UnsavedChangesGuard implements CanDeactivate<ComponentCanDeactivate> {
  
  constructor(private dialog: MatDialog) {}
  
  canDeactivate(component: ComponentCanDeactivate): Observable<boolean> | boolean {
    // If the component doesn't have the canDeactivate method or if it returns true,
    // then navigation is allowed
    if (!component.canDeactivate) {
      return true;
    }
    
    const result = component.canDeactivate();
    
    if (result === true) {
      return true;
    }
    
    if (result instanceof Observable) {
      return result;
    }
    
    // If the component returns false, show a confirmation dialog
    return this.showConfirmationDialog();
  }
  
  private showConfirmationDialog(): Observable<boolean> {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Unsaved Changes',
        message: 'You have unsaved changes. Are you sure you want to leave this page?',
        confirmButton: 'Leave',
        cancelButton: 'Stay'
      }
    });
    
    return dialogRef.afterClosed().pipe(
      map(result => !!result)
    );
  }
}
