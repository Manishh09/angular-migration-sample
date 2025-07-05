import { Component } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SettingsComponent {
  selectedTab = 0;
  
  constructor(
    public authService: AuthService
  ) { }

  onTabChange(event: number): void {
    this.selectedTab = event;
  }
}
