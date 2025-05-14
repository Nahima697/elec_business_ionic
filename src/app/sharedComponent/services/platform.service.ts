// sharedComponent/web/services/platform.service.ts
import { Injectable } from '@angular/core';

import { Capacitor } from '@capacitor/core';

@Injectable({
  providedIn: 'root'
})
export class PlatformService {
  isMobile(): boolean {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }

  isDesktop(): boolean {
    return !this.isMobile();
  }

  isNative(): boolean {
    return Capacitor.isNativePlatform();
  }
}
