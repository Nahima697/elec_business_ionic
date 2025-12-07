import { Component, inject, input, output, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormFieldComponent } from 'src/app/shared-component/form-field/form-field.component';
import { IonIcon, IonButton, IonContent, IonHeader, IonToolbar, IonTitle, IonButtons, IonText } from '@ionic/angular/standalone';
import { ReviewService } from '../service/review.service';
import { ControlType } from 'src/app/shared-component/form-field/form-field.enum.';
import { CommonModule } from '@angular/common';
import { addIcons } from 'ionicons';
import { star, starOutline, close } from 'ionicons/icons';

@Component({
  selector: 'app-review-form',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule,
    IonContent, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonIcon, IonText,
    FormFieldComponent
  ],
  template: `
    <ion-header class="ion-no-border shadow-sm">
      <ion-toolbar color="white">
        <ion-title>Noter la station</ion-title>
        <ion-buttons slot="end">
           <ion-button (click)="cancel.emit()">
             <ion-icon name="close" slot="icon-only"></ion-icon>
           </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding bg-gray-50">
      <form [formGroup]="form" (ngSubmit)="submit()" class="flex flex-col gap-6 mt-4">

        <div class="flex flex-col items-center gap-2">
          <p class="text-sm font-medium text-gray-500">Votre note globale</p>
          <div class="flex gap-2">
            @for(star of [1,2,3,4,5]; track star) {
              <ion-icon
                [name]="star <= selectedRating() ? 'star' : 'star-outline'"
                class="text-4xl transition-transform active:scale-90 cursor-pointer"
                [class.text-yellow-400]="star <= selectedRating()"
                [class.text-gray-300]="star > selectedRating()"
                (click)="selectRating(star)"
              ></ion-icon>
            }
          </div>
          @if (form.controls.reviewRating.invalid && form.controls.reviewRating.touched) {
            <span class="text-xs text-red-500">Une note est requise.</span>
          }
        </div>

        <div class="bg-white p-4 rounded-2xl shadow-sm space-y-4">
          <app-form-field
            label="Titre de votre avis"
            placeholder="Ex: Super recharge !"
            [controlType]="ControlType.Input"
            [formControl]="form.controls.reviewtitle"
          ></app-form-field>

          <app-form-field
            label="Votre expérience"
            placeholder="Racontez-nous comment s'est passée la recharge..."
            [controlType]="ControlType.Textarea"
            [formControl]="form.controls.reviewContent"
          ></app-form-field>
        </div>

        <ion-button
          type="submit"
          expand="block"
          class="mt-4 h-12 rounded-xl font-bold"
          color="primary"
          [disabled]="form.invalid || submitting()"
        >
          @if (submitting()) {
            Publication...
          } @else {
            Publier mon avis
          }
        </ion-button>

      </form>
    </ion-content>
  `,
  styles: [`
    ion-toolbar { --background: white; }
    ion-content { --background: #f9fafb; }
  `]
})
export class ReviewFormComponent {
  stationId = input.required<string>();

  formSubmit = output<void>();
  cancel = output<void>();

  selectedRating = signal(0);
  submitting = signal(false);
  ControlType = ControlType;

  form = new FormGroup({
    reviewtitle: new FormControl('', Validators.required),
    reviewRating: new FormControl(0, [Validators.required, Validators.min(1)]),
    reviewContent: new FormControl('', Validators.required)
  });

  private reviewService = inject(ReviewService);

  constructor() {
    addIcons({ star, starOutline, close });
  }

  selectRating(rating: number) {
    this.selectedRating.set(rating);
    this.form.controls.reviewRating.setValue(rating);
    this.form.controls.reviewRating.markAsTouched();
  }

  submit() {
    if (this.form.invalid) return;

    this.submitting.set(true);

    this.reviewService.submitReview({
      stationId: this.stationId(),
      reviewtitle: this.form.value.reviewtitle!,
      reviewRating: this.form.value.reviewRating!,
      reviewContent: this.form.value.reviewContent!
    }).subscribe({
      next: () => {
        this.submitting.set(false);
        this.form.reset();
        this.selectedRating.set(0);
        this.formSubmit.emit();
      },
      error: () => this.submitting.set(false)
    });
  }
}
