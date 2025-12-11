import { Routes } from '@angular/router';
import { OwnerDashboardComponent } from './owner/pages/owner-dashboard/owner-dashboard.component';
import { RenterDashboardComponent } from './renter/renter-dashboard/renter-dashboard.component';
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
    path: 'select-role',
    loadComponent: () =>
      import('./components/role-selector/role-selector.component')
        .then(m => m.RoleSelectorComponent)
  },
  // --- ROUTES PROPRIÉTAIRE (OWNER) ---
  {
    path: 'owner',
    canActivate: [OwnerGuard],
    children: [
      { path: 'dashboard', component: OwnerDashboardComponent },
      {
        path: 'locations',
        loadComponent: () => import('../charging-station/pages/location/location.component').then(m => m.LocationComponent)
      },
      // { path: 'stations', loadComponent: ... },
      // { path: 'availability-rules', loadComponent: ... },
      // { path: 'bookings', loadComponent: ... }
    ]
  },

  // --- ROUTES LOUEUR (RENTER) ---
  {
    path: 'renter',
    canActivate: [RenterGuard],
    children: [
      { path: 'dashboard', component: RenterDashboardComponent },
      {
        path: 'bookings',
        loadComponent: () => import('../booking/page/booking-page.component').then(m => m.BookingPageComponent)
      },
      // { path: 'history', loadComponent: ... },
      // { path: 'favorites', loadComponent: ... }
    ]
  },

  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  }
,
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  }
];
