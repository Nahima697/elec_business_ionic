import { Routes } from '@angular/router';
import { MobileOnlyGuard } from './sharedComponent/guards/mobile-only.guard';
import { WebOnlyGuard } from './sharedComponent/guards/mobweb-only.guard copy';
import { TabsPage } from './pages/mobile-tabs/tabs/tabs.page';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'onboarding',
    canActivate: [MobileOnlyGuard],
    loadComponent: () => import('./pages/onboarding/onboarding.page').then(m => m.OnboardingPage),
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.page').then(m => m.LoginPage),
  },
  {
    path: 'map',
    loadComponent: () => import('./sharedComponent/display-map/display-map.component').then(m => m.DisplayMapComponent),
  },
  {
    path: 'home',
    canActivate: [WebOnlyGuard],
    loadComponent: () => import('./pages/web-home/home.page').then(m => m.HomePage),
  },
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'reservations',
        loadComponent: () => import('./pages/reservations/reservations.page').then(m => m.ReservationsPage),
      },
      {
        path: 'map',
        loadComponent: () => import('./pages/map/map.page').then(m => m.MapPage),
      },
      {
        path: 'messages',
        loadComponent: () => import('./pages/messages/messages.page').then(m => m.MessagesPage),
      },
      {
        path: 'profile',
        loadComponent: () => import('./pages/profile/profile.page').then(m => m.ProfilePage),
      },
      {
        path: '',
        redirectTo: '/tabs/map',
        pathMatch: 'full'
      }
    ]
  },

  {
    path: 'messages',
    loadComponent: () => import('./pages/messages/messages.page').then( m => m.MessagesPage)
  },
  {
    path: 'profile',
    loadComponent: () => import('./pages/profile/profile.page').then( m => m.ProfilePage)
  },
  {
    path: 'map',
    loadComponent: () => import('./pages/map/map.page').then( m => m.MapPage)
  },
  {
    path: 'reservations',
    loadComponent: () => import('./pages/reservations/reservations.page').then( m => m.ReservationsPage)
  }

];

