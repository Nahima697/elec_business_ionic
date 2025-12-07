import { Component, input } from "@angular/core";
import { IonIcon} from "@ionic/angular/standalone";

@Component({
  selector: 'app-rating-display',
  template: `
    <div class="rating-container">
      <div class="stars">
        @for(star of [1,2,3,4,5]; track star) {
          <ion-icon
            [name]="star <= rating() ? 'star' : 'star-outline'"
            [class.filled]="star <= rating()"
          ></ion-icon>
        }
      </div>
      <span class="rating-text">{{ rating() }}/5 ({{ count() }} avis)</span>
    </div>
  `,
  styles: [`
    .stars { display: flex; gap: 4px; }
    .filled { color: gold; }
  `],
  imports: [
    IonIcon
  ]
})
export class RatingDisplayComponent {
  rating = input.required<number>();
  count = input<number>(0);
}
