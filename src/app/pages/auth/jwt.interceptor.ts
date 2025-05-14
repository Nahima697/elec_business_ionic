import { HttpHandlerFn, HttpRequest, HttpEvent } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';

export function jwtInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> {
  const authService = inject(AuthService);
  const jwtToken = authService.getToken();

  // Si pas de token, ne rien ajouter
  if (!jwtToken) {
    return next(req);
  }

  // Sinon, cloner la requête avec le token
  const newReq = req.clone({
    headers: req.headers.set('X-Authentication-Token', jwtToken),
  });

  return next(newReq);
}
