
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { PlatformService } from 'src/app/shared-component/services/platform.service';

@Injectable({
  providedIn: 'root',
})
export class WebOnlyGuard implements CanActivate {
  constructor(private router: Router, private platformService: PlatformService) {}

  canActivate(): boolean {
    if (this.platformService.isDesktop()) {
      return true;
    } else {
      this.router.navigateByUrl('/onboarding');
      return false;
    }

  }
}
