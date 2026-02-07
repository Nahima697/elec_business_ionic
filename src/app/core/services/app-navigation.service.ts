import { inject, Injectable } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router'; // Ajoute NavigationExtras pour le typage
import { PlatformService } from '../auth/services/platform.service';

@Injectable({ providedIn: 'root' })
export class AppNavigationService {
  private router = inject(Router);
  private platform = inject(PlatformService);

  go(path: string | string[], extras?: NavigationExtras) {
    const segments = Array.isArray(path) ? path : [path];

    if (this.platform.isMobile()) {
      this.router.navigate(['/tabs', ...segments], extras);
    } else {
      this.router.navigate(segments, extras);
    }
  }

  replace(path: string | string[]) {
    const segments = Array.isArray(path) ? path : [path];

    const options: NavigationExtras = { replaceUrl: true };

    if (this.platform.isMobile()) {
      this.router.navigate(['/tabs', ...segments], options);
    } else {
      this.router.navigate(segments, options);
    }
  }
}
