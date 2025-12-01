import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/auth/services/auth.service';
import { IonContent, IonHeader, IonTitle, IonToolbar} from '@ionic/angular/standalone';
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule,IonContent,IonHeader,IonTitle,IonToolbar],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {

  private auth: AuthService = inject(AuthService);
  private router = inject(Router);

  user = this.auth.user; // signal<UserProfileDto | null>

  ngOnInit() {
    const u = this.user();
    if (!u) return;

    if (!u.roles || u.roles.length === 0) {
      this.router.navigate(['/user/select-role']);
    }
  }

  isOwner() {
    return this.auth.hasRole('Owner');
  }

  isRenter() {
    return this.auth.hasRole('Renter');
  }
}
