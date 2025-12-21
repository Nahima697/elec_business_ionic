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

  // 1. Injection de l'URL (C'est correct, on ne touche pas)
  const url = req.url.startsWith('http') ? req.url : environment.apiUrl + req.url;
  const clone = req.clone({ url });

  return next(clone).pipe(
    catchError((error: HttpErrorResponse) => {

      // 2. Gestion intelligente des erreurs
      if (error.status === 401) {

        // CAS A : Erreur lors du LOGIN (Mauvais mot de passe)
        if (req.url.includes('/login')) {
           showToast("Identifiants incorrects.");
        }

        // CAS B : Erreur lors du REFRESH (Le refresh token est aussi expiré)
        // C'est la fin de session réelle.
        else if (req.url.includes('/refresh-token')) {
           authService.logout();
           showToast("Votre session a expiré, veuillez vous reconnecter.");
        }

        // CAS C : Erreur 401 standard (Token d'accès expiré)
        // 🛑 IMPORTANT : ON NE FAIT RIEN ICI !
        // On laisse l'erreur remonter au RefreshTokenInterceptor qui va tenter de rafraîchir.
        // Si on logout ici, on tue le processus de refresh.

      } else if (error.status === 403) {
        showToast("Vous n'avez pas les droits pour effectuer cette action.");
      } else if (error.status === 404) {
        // On évite le toast 404 sur le login ou refresh si nécessaire, sinon OK
        if (!req.url.includes('/login') && !req.url.includes('/refresh-token')) {
           showToast("Ressource introuvable.");
        }
      } else if (error.status >= 500) {
        showToast("Une erreur technique est survenue.");
      }

      // On renvoie toujours l'erreur pour que la chaîne continue (vers RefreshTokenInterceptor)
      return throwError(() => error);
    })
  );
};
