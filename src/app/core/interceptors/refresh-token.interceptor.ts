import { HttpErrorResponse, HttpInterceptorFn } from "@angular/common/http";
import { inject } from "@angular/core";
import { catchError, switchMap, throwError } from "rxjs";
import { AuthService } from "../auth/services/auth.service";

export const refreshTokenInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  // 1. Ignorer les requêtes d'auth pour éviter les boucles infinies
  // On ignore aussi si le header spécial est présent (ajouté dans le service)
  if (req.url.includes('/refresh-token') || req.url.includes('/login') || req.headers.has('X-Skip-Interceptor')) {
    return next(req);
  }

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {

      // 2. On intercepte uniquement les erreurs 401 (Unauthorized)
      if (error.status === 401) {
        console.warn('⚠️ 401 détectée, tentative de refresh...');

        return authService.refreshToken().pipe(
          switchMap((response) => {
            // Le token peut être dans response.token ou directement dans la réponse selon le format
            const newToken = response?.token || response;

            // 3. On clone la requête initiale avec le nouveau token
            const clonedReq = req.clone({
              setHeaders: {
                Authorization: `Bearer ${newToken}`
              }
            });

            // 4. On relance la requête
            return next(clonedReq);
          }),
          catchError((refreshErr) => {
            // Si le refresh échoue aussi, c'est fini, on laisse l'erreur remonter
            // (AuthService.logout() aura déjà été appelé dans le service)
            return throwError(() => refreshErr);
          })
        );
      }

      // Si ce n'est pas une 401, on laisse passer l'erreur
      return throwError(() => error);
    })
  );
};
