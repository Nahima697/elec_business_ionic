import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { LoginPage } from './core/auth/pages/login/login.page';
import { RegisterPage } from './core/auth/pages/register/register.page';
import { BookingPageComponent } from './features/booking/page/booking-page.component';
import { LocationDetailComponent } from './features/charging-station/pages/location-detail/location-detail.component';
import { LocationComponent } from './features/charging-station/pages/location/location.component';
import { StationDetailComponent } from './features/charging-station/pages/station-detail/station-detail.component';
import { ChargingStationComponent } from './features/charging-station/pages/station/charging-station.component';
import { MapPage } from './features/display-map/pages/map.page';
import { TabsPage } from './shared-component/mobile-tabs/tabs/tabs.page';
import { OnboardingPage } from './features/onboarding/onboarding.page';
import { ProfilePage } from './features/profile/page/profile/profile.page';
import { HomePage } from './features/web-home/home/home.page';
import { MobileOnlyGuard } from './core/guards/mobile-only.guard';
import { WebOnlyGuard } from './core/guards/web-only.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },

  // WEB
  {
    path: 'home',
    canActivate: [WebOnlyGuard],
    component: HomePage,
  },

  {
    path: 'reservations',
    canActivate: [WebOnlyGuard],
    loadComponent: () => import('./features/booking/page/booking-page.component').then(m => m.BookingPageComponent)
  },

  // MOBILE
  {
    path: 'onboarding',
    canActivate: [MobileOnlyGuard],
    component: OnboardingPage,
  },

  {
    path: 'tabs',
    canActivate: [MobileOnlyGuard],
    component: TabsPage,
    children: [
      { path: 'map', component: MapPage },
      { path: 'reservations', component: BookingPageComponent },
      { path: 'profile', component: ProfilePage },
      { path: '', redirectTo: '/tabs/map', pathMatch: 'full' },
      {
        path: 'user',
        loadChildren: () => import('./features/user/user.routes').then(m => m.USER_ROUTES),
        canActivate: [AuthGuard]
      },
    ],
  },

  // AUTH
  { path: 'login', component: LoginPage },
  { path: 'register', component: RegisterPage },

  // USER MODULE
  {
    path: 'user',
    loadChildren: () => import('./features/user/user.routes')
      .then(m => m.USER_ROUTES),
    canActivate: [AuthGuard]
  },

  // STATIONS
  { path: 'location', component: LocationComponent },
  { path: 'location/:id', component: LocationDetailComponent },
  { path: 'station', component: ChargingStationComponent },
  { path: 'station/:id', component: StationDetailComponent },

  // WEB MAP
  { path: 'map', component: MapPage},
  {
    path: 'profile',
    loadComponent: () => import('./features/profile/page/profile/profile.page').then( m => m.ProfilePage)
  },
];
