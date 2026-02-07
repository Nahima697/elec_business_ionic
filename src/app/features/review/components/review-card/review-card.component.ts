import { Component, input } from '@angular/core';
import { DatePipe } from '@angular/common';
import {
  IonCard,
  IonCardHeader,
  IonCardContent,
  IonAvatar,
  IonIcon,

} from "@ionic/angular/standalone";
import { reviewResponseDTO } from '../../models/review.model';

@Component({
  selector: 'app-review-card',
  templateUrl: './review-card.component.html',
  styleUrls: ['./review-card.component.scss'],
  imports: [
    DatePipe,
    IonCard,
    IonCardHeader,
    IonCardContent,
    IonAvatar,
    IonIcon
  ]
})
export class ReviewCardComponent {
  readonly review = input.required<reviewResponseDTO>();
}
