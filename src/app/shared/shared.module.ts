import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OverlayModule } from '@angular/cdk/overlay';
import { LoaderComponent } from './components/loader/loader.component';
import { UserMenuComponent } from './components/user-menu/user-menu.component';
import { UserRoleBadgeComponent } from './components/user-role-badge/user-role-badge.component';
import { MaterialModule } from '../material/material.module';
import { HighlightDirective } from './directives/highlight.directive';
import { DebounceClickDirective } from './directives/debounce-click.directive';
import { TruncatePipe } from './pipes/truncate.pipe';
import { AutofocusDirective } from './directives/autofocus.directive';
import { ClickOutsideDirective } from './directives/click-outside/click-outside.directive';

@NgModule({
  declarations: [
    // Components
    LoaderComponent,
    UserMenuComponent,
    UserRoleBadgeComponent,
    
    // Directives, Pipes
    HighlightDirective,
    TruncatePipe,
    AutofocusDirective,
    ClickOutsideDirective,
    DebounceClickDirective
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
    UserRoleBadgeComponent,
    
    // Directives, Pipes
    HighlightDirective,
    TruncatePipe,
    AutofocusDirective,
    ClickOutsideDirective,
    DebounceClickDirective
  ]
})
export class SharedModule { }
