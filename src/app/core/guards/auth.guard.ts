import { CanActivateFn } from '@angular/router';
import { AuthService } from '../auth/services/auth.service';
import { inject } from '@angular/core';
import { Router } from '@angular/router';

export const AuthGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const isLogged = authService.isLoggedIn();

  if (!isLogged) {
    router.navigate(['/login']);
    return false;
  }

  return true;
};
