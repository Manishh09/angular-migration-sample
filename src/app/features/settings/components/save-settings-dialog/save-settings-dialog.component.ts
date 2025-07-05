import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

export interface SaveSettingsDialogData {
  changedSections: string[];
}

@Component({
  selector: 'app-save-settings-dialog',
  templateUrl: './save-settings-dialog.component.html',
  styleUrls: ['./save-settings-dialog.component.scss']
})
export class SaveSettingsDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<SaveSettingsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: SaveSettingsDialogData
  ) {}

  onCancel(): void {
    this.dialogRef.close(false);
  }

  onSave(): void {
    this.dialogRef.close(true);
  }
}
