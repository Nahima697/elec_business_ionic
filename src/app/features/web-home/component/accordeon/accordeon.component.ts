import { Component } from '@angular/core';
import { IonAccordion, IonAccordionGroup, IonItem, IonLabel } from '@ionic/angular/standalone';

@Component({
  selector: 'app-accordeon',
  standalone:true,
  imports: [IonAccordion, IonAccordionGroup, IonItem, IonLabel],
  templateUrl: './accordeon.component.html',
  styleUrl: './accordeon.component.css'
})
export class AccordeonComponent {

 
}
