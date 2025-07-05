import { NgModule } from '@angular/core';
import { RouterModule, Routes, Route } from '@angular/router';
import { HomeComponent } from './home/home.component';

/**
 * Type definition for route data to enforce type safety
 */
interface HomeRouteData {
  breadcrumb: string;
  preload?: boolean;
}

/**
 * Type-safe home route with specific data structure
 */
type HomeRoute = Route & {
  data?: HomeRouteData;
  title?: string;
};

/**
 * Home feature module routes with strict typing
 * Contains the main landing page route
 */
const routes: HomeRoute[] = [
  {
    path: '',
    component: HomeComponent,
    title: 'Home - Angular Migration Sample',
    data: {
      breadcrumb: 'Home',
      preload: true
    }
  }
];

/**
 * Home Routing Module
 * 
 * Configures routes for the home feature module
 */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
