import { Routes } from '@angular/router';
import { AuthGuard } from './core/auth/guards/auth.guard';
import { LoginPage } from './core/auth/pages/login/login.page';
import { RegisterPage } from './core/auth/pages/register/register.page';
import { EmailVerifiedComponent } from './core/auth/pages/verif-method/verif-email.component';
import { VerifMethodPage } from './core/auth/pages/verif-method/verif-method.page';
import { BookingPageComponent } from './features/booking/page/booking-page.component';
import { LocationDetailComponent } from './features/charging-station/location-detail/location-detail.component';
import { LocationComponent } from './features/charging-station/location/location.component';
import { StationDetailComponent } from './features/charging-station/station-detail/station-detail.component';
import { ChargingStationComponent } from './features/charging-station/station/charging-station.component';
import { MapPage } from './pages/map/map.page';
import { MessagesPage } from './pages/messages/messages.page';
import { TabsPage } from './pages/mobile-tabs/tabs/tabs.page';
import { OnboardingPage } from './pages/onboarding/onboarding.page';
import { ProfilePage } from './pages/profile/profile.page';
import { HomePage } from './pages/web-home/home/home.page';
import { MobileOnlyGuard } from './sharedComponent/guards/mobile-only.guard';
import { WebOnlyGuard } from './sharedComponent/guards/web-only.guard copy';

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
    component: BookingPageComponent
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
      { path: 'messages', component: MessagesPage },
      { path: 'reservations', component: BookingPageComponent },
      { path: 'profile', component: ProfilePage },
      { path: '', redirectTo: '/tabs/map', pathMatch: 'full' },
    ],
  },

  // AUTH
  { path: 'login', component: LoginPage },
  { path: 'register', component: RegisterPage },
  { path: 'verify-email-info', component: VerifMethodPage },
  { path: 'email-verified', component: EmailVerifiedComponent },

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
];
