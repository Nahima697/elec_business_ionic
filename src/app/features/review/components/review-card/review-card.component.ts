import { Component, input, OnInit } from '@angular/core';
import { reviewResponseDTO } from '../../models/review.model';

@Component({
  selector: 'app-review-card',
  templateUrl: './review-card.component.html',
  styleUrls: ['./review-card.component.scss'],
})
export class ReviewCardComponent  {

readonly review = input.required<reviewResponseDTO>();


}
