import { Component, output } from '@angular/core'; // Note: 'output' est la nouvelle syntaxe Angular 17+ (sinon utilise @Output)
import { UserRoleDTO } from '../../models/user.model';
import { IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { carSportOutline, flashOutline, arrowForwardOutline } from 'ionicons/icons';

@Component({
  selector: 'app-role-selector',
  standalone: true,
  imports: [IonIcon],
  templateUrl: './role-selector.component.html',
  styleUrls: ['./role-selector.component.scss']
})
export class RoleSelectorComponent {
  roleSelected = output<string>();

  constructor() {
    addIcons({ carSportOutline, flashOutline, arrowForwardOutline });
  }

  selectRole(role: string) {
    this.roleSelected.emit(role);
  }
}
