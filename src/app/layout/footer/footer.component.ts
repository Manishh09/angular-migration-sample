import { Component } from '@angular/core';

/**
 * Footer Component
 * 
 * Appears at the bottom of every page with copyright and link information.
 */
@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {
  public readonly currentYear = new Date().getFullYear();
}
