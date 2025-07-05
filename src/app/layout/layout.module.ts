import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// Feature Modules
import { MaterialModule } from '../material/material.module';
import { SharedModule } from '../shared/shared.module';

// Components
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';

/**
 * Layout Module
 * 
 * Provides the main layout components for the application.
 * This includes the header and footer components which are 
 * used across multiple pages.
 */
@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule,
    SharedModule
  ],
  exports: [
    HeaderComponent,
    FooterComponent
  ]
})
export class LayoutModule { }
