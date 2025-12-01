import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from 'src/app/core/auth/services/auth.service';

export const RenterGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (auth.hasRole('ROLE_RENTER')) {
    return true;
  }

  // L’utilisateur n’a pas le rôle loueur → redirection
  return router.parseUrl('/user/select-role');
};
