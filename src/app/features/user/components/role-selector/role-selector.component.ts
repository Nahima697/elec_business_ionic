import { Component, inject, OnInit } from '@angular/core';
import { UserService } from '../../service/user.service';
import { AuthService } from 'src/app/core/auth/services/auth.service';
import { IonHeader,IonContent,IonButton,IonTitle,IonToolbar} from "@ionic/angular/standalone";


@Component({
  selector: 'app-role-selector',
  imports: [IonHeader, IonContent, IonButton, IonTitle, IonToolbar],
  templateUrl: './role-selector.component.html',
  styleUrls: ['./role-selector.component.scss'],
})
export class RoleSelectorComponent   {
  private auth = inject(AuthService);
  private userService = inject(UserService);

  user = this.auth.user();

  setRole(role: 'owner' | 'renter') {
    if (!this.user) return;

    this.userService.addRole(this.user.id, role).subscribe(() => {
      this.auth.fetchCurrentUser().subscribe();
    });
  }
}



