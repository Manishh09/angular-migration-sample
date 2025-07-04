import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  selectedTab = 0;
  
  constructor(
    public authService: AuthService
  ) { }

  ngOnInit(): void {
    // Any initialization logic for the container component
  }

  onTabChange(event: number): void {
    this.selectedTab = event;
  }
}
