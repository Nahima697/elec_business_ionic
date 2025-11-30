import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-email-verified',
  template: `
     @if(success) {
   <p>
      ✅ Votre email a été vérifié avec succès !
  </p>
     }
  @else {
    <ng-template #error>
        ❌ La vérification a échoué ou le lien a expiré.
      </ng-template>
}

  `
})
export class EmailVerifiedComponent {
  success = false;

  constructor(private route: ActivatedRoute) {
    this.route.queryParams.subscribe(params => {
      this.success = params['success'] === 'true';
    });
  }
}
