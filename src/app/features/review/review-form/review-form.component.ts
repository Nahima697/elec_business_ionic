import { Component, inject, input, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormFieldComponent } from 'src/app/sharedComponent/form-field/form-field.component';
import { IonIcon,IonButton } from '@ionic/angular/standalone';
import { ReviewService } from '../service/review.service';
import { ModalController } from '@ionic/angular/standalone';
import { ControlType } from 'src/app/sharedComponent/form-field/form-field.enum.';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-review-form',
  template: `
    <form [formGroup]="form" (ngSubmit)="submit()">
      <div class="rating-input">
        @for(star of [1,2,3,4,5]; track star) {
          <ion-icon
            [name]="star <= selectedRating() ? 'star' : 'star-outline'"
            (click)="selectRating(star)"
          ></ion-icon>
        }
      </div>
       <app-form-field
        label="Commentaire"
        [controlType]="ControlType.Input"
        [formControl]="form.controls.reviewtitle"
      />

      <app-form-field
        label="Commentaire"
        [controlType]="ControlType.Textarea"
        [formControl]="form.controls.reviewContent"
      />

      <ion-button type="submit" expand="block" [disabled]="form.invalid">
        Publier l'avis
      </ion-button>
    </form>
  `,
  styles: [`
    .rating-input {
      display: flex;
      gap: 8px;
      margin-bottom: 16px;
    }
    ion-icon {
      font-size: 32px;
      cursor: pointer;
    }
  `],
  imports: [
    IonIcon,FormFieldComponent,IonButton,CommonModule, FormsModule,ReactiveFormsModule
  ]
})

export class ReviewFormComponent {
  stationId = input.required<string>();
  selectedRating = signal(0);
  ControlType = ControlType;
  form = new FormGroup({
    reviewtitle: new FormControl('', Validators.required),
    reviewRating: new FormControl(0, [Validators.required, Validators.min(1)]),
    reviewContent: new FormControl('', Validators.required)
  });

  private reviewService : ReviewService= inject(ReviewService);
  private modalCtrl = inject(ModalController);

  selectRating(rating: number) {
    this.selectedRating.set(rating);
    this.form.controls.reviewRating.setValue(rating);
  }

  submit() {
    if (this.form.invalid) return;

    this.reviewService.submitReview({
      stationId: this.stationId(),
      reviewtitle: this.form.value.reviewtitle!,
      reviewRating: this.form.value.reviewRating!,
      reviewContent: this.form.value.reviewContent!
    }).subscribe({
      next: () => this.modalCtrl.dismiss({ success: true })
    });
  }
}
