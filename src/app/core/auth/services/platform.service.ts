import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Capacitor } from '@capacitor/core';

@Injectable({
  providedIn: 'root',
})
export class PlatformService {
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  isMobile(): boolean {

    if (!this.isBrowser()) return false;

    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
  }

  isDesktop(): boolean {
    if (!this.isBrowser()) return false;
    return !this.isMobile();
  }

  isNative(): boolean {
    if (!this.isBrowser()) return false;
    return Capacitor.isNativePlatform();
  }
}
