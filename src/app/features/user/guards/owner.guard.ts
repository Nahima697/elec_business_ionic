import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from 'src/app/core/auth/services/auth.service';

export const OwnerGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (auth.hasRole('ROLE_OWNER')) {
    return true;
  }

  // L'utilisateur n'a pas le rôle propriétaire → redirection
  return router.parseUrl('/user/select-role');
};
