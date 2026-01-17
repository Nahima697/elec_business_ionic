import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { PlatformService } from './platform.service';

@Injectable({ providedIn: 'root' })
export class AppNavigationService {
    private router = inject(Router);
    private platform = inject(PlatformService);


  go(path: string | string[]) {
    const segments = Array.isArray(path) ? path : [path];

    if (this.platform.isMobile()) {
      this.router.navigate(['/tabs', ...segments]);
    } else {
      this.router.navigate(segments);
    }
  }

  replace(path: string | string[]) {
    const segments = Array.isArray(path) ? path : [path];

    if (this.platform.isMobile()) {
      this.router.navigate(['/tabs', ...segments], { replaceUrl: true });
    } else {
      this.router.navigate(segments, { replaceUrl: true });
    }
  }
}
