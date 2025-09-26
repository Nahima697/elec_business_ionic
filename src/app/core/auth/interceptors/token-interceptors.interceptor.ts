import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { catchError, concatMap, Observable, of } from 'rxjs';
import { HttpEvent, HttpErrorResponse } from '@angular/common/http';
export const tokenInterceptorsInterceptor: HttpInterceptorFn = (req, next) => {
   const authService = inject(AuthService);
  const jwtToken = authService.getToken();

  // Si pas de token ou requête de refreshToken, ne rien ajouter
  if (!jwtToken || req.url.includes('refreshToken')) {
    return next(req);
  }

  console.log('Adding auth header:', `Bearer ${jwtToken}`);

  // Cloner la requête et ajouter le header Authorization
  const newReq = req.clone({
    headers: req.headers.set('Authorization', `Bearer ${jwtToken}`),
  });

  console.log('Interceptor actif, token ajouté :', jwtToken);

  // Maintenant on force le type de retour de next(newReq)
  const nextResponse: Observable<HttpEvent<any>> = next(newReq);

  return nextResponse.pipe(
    catchError((error: HttpErrorResponse) => {
      // Si l'erreur est de type 403, on tente de rafraîchir le token
      if (error.status === 403) {
        return authService.refreshToken().pipe(
          concatMap(() => {
            // Après avoir rafraîchi le token, on renvoie la requête
            return next(newReq);
          })
        );
      }

      // Si ce n'est pas une erreur 403, on relance l'erreur
      return of(error);
    })
  );
};

