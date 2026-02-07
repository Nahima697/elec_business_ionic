import { Component, inject, input, output, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonButton, IonIcon, IonText, IonTextarea, IonItem, IonLabel, ToastController } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { star, starOutline } from 'ionicons/icons';
import { ReviewService } from '../../service/review.service';

@Component({
  selector: 'app-review-form',
  standalone: true,
  imports: [ReactiveFormsModule, IonButton, IonIcon, IonTextarea],
  template: `
    <div class="p-4 text-center">
      <h2 class="text-xl font-bold mb-4">Notez votre expérience</h2>

      <div class="flex justify-center gap-2 mb-6">
        @for (star of [1, 2, 3, 4, 5]; track star) {
          <ion-icon
            [name]="star <= rating() ? 'star' : 'star-outline'"
            class="text-4xl cursor-pointer transition-transform active:scale-110"
            [class.text-yellow-400]="star <= rating()"
            [class.text-gray-300]="star > rating()"
            (click)="setRating(star)">
          </ion-icon>
        }
      </div>

      <p class="mb-4 font-medium text-gray-600">
        {{ rating() }}/5 - {{ getRatingLabel() }}
      </p>

      <form [formGroup]="form" (ngSubmit)="submit()">
        <ion-textarea
          formControlName="reviewContent"
          label="Votre avis (optionnel)"
          label-placement="floating"
          fill="outline"
          rows="4"
          placeholder="Dites-nous ce que vous en avez pensé..."
          class="mb-4"
        ></ion-textarea>

        <div class="flex gap-3">
          <ion-button fill="outline" color="medium" class="flex-1" (click)="cancel.emit()">
            Annuler
          </ion-button>
          <ion-button type="submit" class="flex-1" [disabled]="rating() === 0">
            Envoyer
          </ion-button>
        </div>
      </form>
    </div>
  `
})
export class ReviewFormComponent {
  private fb = inject(FormBuilder);
  private reviewService = inject(ReviewService);
  private toastCtrl = inject(ToastController);

  stationId = input.required<string>();

  formSubmit = output<void>();
  cancel = output<void>();

  rating = signal(0);

  form = this.fb.group({
    reviewContent: ['']
  });

  constructor() {
    addIcons({ star, starOutline });
  }

  setRating(value: number) {
    this.rating.set(value);
  }

  getRatingLabel() {
    const r = this.rating();
    if (r === 5) return 'Excellent ! 🤩';
    if (r === 4) return 'Très bien 🙂';
    if (r === 3) return 'Moyen 😐';
    if (r === 2) return 'Décevant 😕';
    if (r === 1) return 'À éviter 😡';
    return 'Notez pour commencer';
  }

  submit() {
    if (this.rating() === 0) return;

    const reviewDTO = {
      reviewTitle: 'Avis utilisateur',
      reviewContent: this.form.value.reviewContent || '',
      reviewRating: this.rating(),
      stationId: this.stationId()
    };

    // Appel à submitReview
    this.reviewService.submitReview(reviewDTO).subscribe({
      next: async () => {
        const toast = await this.toastCtrl.create({
          message: 'Merci pour votre avis !',
          duration: 2000,
          color: 'success',
          position: 'top'
        });
        toast.present();
        this.formSubmit.emit();
      },
      error: async (err) => {
        console.error(err);
        const toast = await this.toastCtrl.create({
          message: 'Erreur lors de l\'envoi de l\'avis.',
          duration: 3000,
          color: 'danger',
          position: 'top'
        });
        toast.present();
      }
    });
  }
}
