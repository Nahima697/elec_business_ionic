import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { HttpErrorResponse, HttpEvent, HttpRequest } from '@angular/common/http';
import { Observable, catchError, concatMap, throwError } from 'rxjs';

export const jwtInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next
): Observable<HttpEvent<unknown>> => {
  const authService = inject(AuthService);
  const jwtToken = authService.getToken();

  if (!jwtToken || req.url.includes('refreshToken')) {
    return next(req);
  }

  const newReq = req.clone({
    headers: req.headers.set('Authorization', `Bearer ${jwtToken}`),
  });

  return next(newReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 403) {
        return authService.refreshToken().pipe(
          concatMap(() => next(newReq))
        );
      }
      return throwError(() => error);
    })
  );
};
