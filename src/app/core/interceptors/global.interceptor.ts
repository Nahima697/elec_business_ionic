import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth/services/auth.service';

export const globalInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const clone = req.clone({
     url: req.url.startsWith('http') ? req.url : environment.apiUrl + req.url
  })
  return next(clone).pipe(catchError((error: HttpErrorResponse) => {
    if (error.status === 401) {
      // Token expiré -> Redirect Login + Toast "Session expirée"
      authService.logout();
    } else if (error.status === 403) {
      // Pas les droits -> Toast "Accès interdit"
    } else if (error.status === 404) {
      // Ressource non trouvée -> Toast ou Redirect 404
    } else {
      // Erreur 500 ou inconnue -> Toast "Oups, une erreur est survenue"
    }
    return throwError(() => error);
  }));
};

//return next.handle(request).pipe(


