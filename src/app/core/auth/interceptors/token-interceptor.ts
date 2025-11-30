import { HttpInterceptorFn, HttpEvent } from '@angular/common/http';
import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { REQUEST } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const tokenInterceptor: HttpInterceptorFn = (req, next): Observable<HttpEvent<any>> => {
  const platformId = inject(PLATFORM_ID);
  const authService = inject(AuthService);

  let token: string | null = null;

  if (!isPlatformBrowser(platformId)) {
    const serverReq = inject(REQUEST) as any;
    token = serverReq.cookies?.authToken || null;
  } else {
    token = authService.getToken();
  }

  let newReq = req;

  if (token && !req.url.includes('refreshToken')) {
    newReq = req.clone({ headers: req.headers.set('Authorization', `Bearer ${token}`) });
  }

  newReq = newReq.clone({ withCredentials: true });

  return next(newReq);
};
