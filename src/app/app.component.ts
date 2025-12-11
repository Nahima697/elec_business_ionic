import { Component, inject, OnInit } from '@angular/core';
import { PlatformService } from './shared-component/services/platform.service';
import { Router} from '@angular/router';
import { IonApp, IonRouterOutlet } from "@ionic/angular/standalone";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [IonRouterOutlet,  IonApp]
})
export class AppComponent implements OnInit {
  private platformService = inject(PlatformService);
  private router = inject(Router);

  ngOnInit() {
    // if (this.platformService.isWeb()) {
    //   this.router.navigate(['/home']);
    // } else {
    //   this.router.navigate(['/onboarding']);
    // }
  }
}
