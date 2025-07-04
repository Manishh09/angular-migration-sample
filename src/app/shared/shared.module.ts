import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OverlayModule } from '@angular/cdk/overlay';
import { LoaderComponent } from './components/loader/loader.component';
import { UserMenuComponent } from './components/user-menu/user-menu.component';
import { MaterialModule } from '../material/material.module';
import { HighlightDirective } from './directives/highlight.directive';
import { TruncatePipe } from './pipes/truncate.pipe';
import { AutofocusDirective } from './directives/autofocus.directive';
import { ClickOutsideDirective } from './directives/click-outside/click-outside.directive';

@NgModule({
  declarations: [
    // Components
    LoaderComponent,
    UserMenuComponent,
    
    // Directives, Pipes
    HighlightDirective,
    TruncatePipe,
    AutofocusDirective,
    ClickOutsideDirective
  ],
  imports: [
    CommonModule,
    MaterialModule,
    OverlayModule
  ],
  exports: [
    // Components
    LoaderComponent,
    UserMenuComponent,
    
    // Directives, Pipes
    HighlightDirective,
    TruncatePipe,
    AutofocusDirective,
    ClickOutsideDirective
  ]
})
export class SharedModule { }
