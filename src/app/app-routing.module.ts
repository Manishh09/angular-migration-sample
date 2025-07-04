import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminAuthGuard } from './core/guards/admin-auth.guard';
import { AuthGuard } from './core/guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'user',
    loadChildren: () => import('./features/user/user.module').then(m => m.UserModule)
  },
  {
    path: 'admin',
    canActivate: [AdminAuthGuard],
    canLoad: [AdminAuthGuard],
    loadChildren: () => import('./features/admin/admin.module').then(m => m.AdminModule)
  },
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.module').then(m => m.AuthModule)
  },
  {
    path: 'home',
    loadChildren: () => import('./features/home/home.module').then(m => m.HomeModule)
  },
  {
    path: 'profile',
    canActivate: [AuthGuard],
    canLoad: [AuthGuard],
    loadChildren: () => import('./features/profile/profile.module').then(m => m.ProfileModule)
  },
  {
    path: 'settings',
    canActivate: [AuthGuard],
    canLoad: [AuthGuard],
    loadChildren: () => import('./features/settings/settings.module').then(m => m.SettingsModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
