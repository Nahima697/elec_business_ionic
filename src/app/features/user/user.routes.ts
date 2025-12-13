import { Routes } from '@angular/router';
import { OwnerDashboardComponent } from './owner/pages/owner-dashboard/owner-dashboard.component';
import { RenterDashboardComponent } from './renter/pages/renter-dashboard/renter-dashboard.component';
import { OwnerGuard } from './guards/owner.guard';
import { RenterGuard } from './guards/renter.guard';
import { DashboardComponent } from './pages/dashboard/dashboard.component';

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
      {
        path: 'bookings',
        loadComponent: () => import('./owner/pages/booking-page/booking.page').then(m => m.BookingPage)
      },
      {
        path: 'locations',
        loadComponent: () => import('../charging-station/pages/location/location.component').then(m => m.LocationComponent)
      },
        {
        path: 'stations',
        loadComponent: () => import('../charging-station/component/station-list/station-list.component').then(m => m.StationListComponent)
      },
      {
        path: 'availability-rules',
        loadComponent: () => import('../charging-station/pages/availability-rules/availability-rules.component').then(m => m.AvailabilityRulesComponent)
      }

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
    ]
  },

{
    path: '',
    component: DashboardComponent,
  },
];
