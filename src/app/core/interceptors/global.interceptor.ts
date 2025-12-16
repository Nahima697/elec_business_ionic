import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs'; // <--- Check this import
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth/services/auth.service';
import { ToastController } from '@ionic/angular';

export const globalInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const toastCtrl = inject(ToastController);

  const showToast = async (msg: string, color: string = 'danger') => {
    const toast = await toastCtrl.create({
      message: msg,
      duration: 3000,
      color: color,
      position: 'bottom'
    });
    await toast.present();
  };

  // Don't modify the URL if it's already an absolute URL (e.g. Nominatim or assets)
  const url = req.url.startsWith('http') ? req.url : environment.apiUrl + req.url;

  const clone = req.clone({ url });

  return next(clone).pipe(
    catchError((error: HttpErrorResponse) => {

      // We handle the side effects (Toast, Logout)
      if (error.status === 401) {
        if (!req.url.includes('/login')) {
           authService.logout();
           showToast("Session expired, please log in again.");
        } else {
            showToast("Invalid credentials, please try again.");
        }
      } else if (error.status === 403) {
        showToast("You do not have the rights to perform this action.");
      } else if (error.status === 404) {
        if (!req.url.includes('/login')) {
           showToast("Resource not found.");
        }
      } else {
        showToast("A technical error occurred.");
      }
      return throwError(() => error);
    })
  );
};
