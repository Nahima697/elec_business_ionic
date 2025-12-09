import { Component, input } from '@angular/core';
import { reviewResponseDTO } from '../../models/review.model';
import { ReviewCardComponent } from "../review-card/review-card.component";
import { IonIcon } from "@ionic/angular/standalone";

@Component({
  selector: 'app-review-list',
  templateUrl: './review-list.component.html',
  styleUrls: ['./review-list.component.scss'],
  imports: [ReviewCardComponent, IonIcon],
})
export class ReviewListComponent {
  readonly reviews = input.required<reviewResponseDTO[]>();
}
