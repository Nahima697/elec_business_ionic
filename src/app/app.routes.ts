import { Routes } from '@angular/router';
import { MobileOnlyGuard } from './sharedComponent/guards/mobile-only.guard';
import { WebOnlyGuard } from './sharedComponent/guards/web-only.guard copy';
import { TabsPage } from './pages/mobile-tabs/tabs/tabs.page';
import { EmailVerifiedComponent } from './core/auth/pages/verif-method/verif-email.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },

  // --- Web only ---
  {
    path: 'home',
    canActivate: [WebOnlyGuard],
    loadComponent: () =>
      import('./pages/web-home/home.page').then((m) => m.HomePage),
  },

  // --- Mobile only ---
  {
    path: 'onboarding',
    canActivate: [MobileOnlyGuard],
    loadComponent: () =>
      import('./pages/onboarding/onboarding.page').then(
        (m) => m.OnboardingPage
      ),
  },
  {
    path: 'tabs',
    component: TabsPage,
    canActivate: [MobileOnlyGuard],
    children: [
      {
        path: 'reservations',
        loadComponent: () =>
          import('./pages/reservations/reservations.page').then(
            (m) => m.ReservationsPage
          ),
      },
      {
        path: 'map',
        loadComponent: () =>
          import('./pages/map/map.page').then((m) => m.MapPage),
      },
      {
        path: 'messages',
        loadComponent: () =>
          import('./pages/messages/messages.page').then(
            (m) => m.MessagesPage
          ),
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('./pages/profile/profile.page').then(
            (m) => m.ProfilePage
          ),
      },
      { path: '', redirectTo: '/tabs/map', pathMatch: 'full' },
    ],
  },

  // --- Shared (web + mobile) ---
  {
    path: 'login',
    loadComponent: () =>
      import('./core/auth/pages/login/login.page').then((m) => m.LoginPage),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./core/auth/pages/register/register.page').then(
        (m) => m.RegisterPage
      ),
  },
  {
    path: 'verify-email-info',
    loadComponent: () =>
      import('./core/auth/pages/verif-method/verif-method.page').then(
        (m) => m.VerifMethodPage
      ),
  },

  { path: 'email-verified',loadComponent: () =>
    import('./core/auth/pages/verif-method/verif-email.component')
    .then((m) =>m.EmailVerifiedComponent),
   },

  // --- Charging station
      {
        path: 'location',
        loadComponent: () =>
          import('./features/charging-station/location/location.component').then(
            (m) => m.LocationComponent
          ),
      },
      {
        path: 'location/:id',
        loadComponent: () =>
          import(
            './features/charging-station/location-detail/location-detail.component'
          ).then((m) => m.LocationDetailComponent),
      },
      {
        path: 'station',
        loadComponent: () =>
          import('./features/charging-station/charging-station.component').then(
            (m) => m.ChargingStationComponent
          ),
      },
      {
        path: 'station/:id',
        loadComponent: () =>
          import(
            './features/charging-station/station-detail/station-detail.component'
          ).then((m) => m.StationDetailComponent),
      },

  // --- Map standalone (si besoin hors tabs) ---
  {
    path: 'map',
    loadComponent: () =>
      import('./pages/map/map.page').then((m) => m.MapPage),
  },
];
