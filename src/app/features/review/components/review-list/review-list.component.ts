import { Component, input, OnInit } from '@angular/core';
import { reviewResponseDTO } from '../../models/review.model';
import { ReviewCardComponent } from "../review-card/review-card.component";

@Component({
  selector: 'app-review-list',
  templateUrl: './review-list.component.html',
  styleUrls: ['./review-list.component.scss'],
  imports: [ReviewCardComponent],
})
export class ReviewListComponent  {
readonly reviews = input.required<reviewResponseDTO[]>();

}
