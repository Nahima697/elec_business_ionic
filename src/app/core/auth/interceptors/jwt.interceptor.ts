import { HttpHandlerFn, HttpRequest, HttpEvent } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
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
console.log('Adding auth header:', `Bearer ${jwtToken}`);
  // Sinon, cloner la requête avec le token
  const newReq = req.clone({
  headers: req.headers.set('Authorization', `Bearer ${jwtToken}`),
});
console.log('Intercepteur actif, token ajouté :', jwtToken);


  return next(newReq);
}
