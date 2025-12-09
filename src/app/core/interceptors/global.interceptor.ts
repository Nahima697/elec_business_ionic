import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
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
  const clone = req.clone({
     url: req.url.startsWith('http') ? req.url : environment.apiUrl + req.url
  })
  return next(clone).pipe(catchError((error: HttpErrorResponse) => {
    if (error.status === 401) {
      authService.logout();
      showToast("Session expirée, veuillez vous reconnecter.");
    } else if (error.status === 403) {
      showToast("Vous n'avez pas les droits pour effectuer cette action.");
    } else if (error.status === 404) {
      showToast("Ressource introuvable.");
    } else {
      showToast("Une erreur technique est survenue.");
    }
    return throwError(() => error);
  }));
};
