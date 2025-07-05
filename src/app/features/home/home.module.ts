import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Type } from '@angular/core';

// Feature routing
import { HomeRoutingModule } from './home-routing.module';

// Components
import { HomeComponent } from './home/home.component';

// Shared modules
import { MaterialModule } from 'src/app/material/material.module';

/**
 * Type-safe component declarations array
 */
const COMPONENTS: Type<any>[] = [
  HomeComponent
];

/**
 * Type-safe module imports array
 */
const MODULES = [
  // Angular modules
  CommonModule,
  
  // Feature routing
  HomeRoutingModule,
  
  // Shared modules
  MaterialModule
];

/**
 * Home Feature Module
 * 
 * Contains the main landing page of the application.
 * Demonstrates a clean, organized Angular feature module structure.
 * Uses TypeScript best practices for type safety.
 */
@NgModule({
  declarations: [...COMPONENTS],
  imports: [...MODULES]
})
export class HomeModule { }
