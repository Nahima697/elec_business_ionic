import { Routes } from '@angular/router';
import { OwnerDashboardComponent } from './components/owner-dashboard/owner-dashboard.component';
import { RenterDashboardComponent } from './components/renter-dashboard/renter-dashboard.component';
import { OwnerGuard } from './guards/owner.guard';
import { RenterGuard } from './guards/renter.guard';

export const USER_ROUTES: Routes = [
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./pages/dashboard/dashboard.component')
        .then(m => m.DashboardComponent)
  },
  {
    path: 'profile',
    loadComponent: () =>
      import('./pages/profile/profile.component')
        .then(m => m.ProfileComponent)
  },
  {
    path: 'select-role',
    loadComponent: () =>
      import('./components/role-selector/role-selector.component')
        .then(m => m.RoleSelectorComponent)
  },
   {
  path: 'owner/dashboard',
  component: OwnerDashboardComponent,
  canActivate: [OwnerGuard]
},
{
  path: 'renter/dashboard',
  component: RenterDashboardComponent,
  canActivate: [RenterGuard]
}
,
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  }
];
