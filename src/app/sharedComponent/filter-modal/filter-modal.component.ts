import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { IonFooter,
  IonButton,IonContent,IonCol,AnimationController,ModalController, IonIcon, IonGrid, IonRow } from "@ionic/angular/standalone";
import { addIcons } from 'ionicons';
import { closeOutline, filterOutline} from 'ionicons/icons';
import { FormFieldComponent } from '../form-field/form-field.component';
import { ControlType } from '../form-field/form-field.enum.';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-filter-modal',
  standalone:true,
  imports:[
    IonButton,
    IonContent,
    IonGrid,
    IonRow,
    FormFieldComponent,
    IonIcon,IonCol,IonFooter
    ],
  templateUrl: './filter-modal.component.html',
  styleUrls: ['./filter-modal.component.scss'],
})
export class FilterModalComponent  implements OnInit {
  private animationCtrl = inject(AnimationController);
  private modalCtrl= inject(ModalController);
  ControlType: typeof ControlType = ControlType;
  openPlace = false;
  openTrajet = false;
  openDate = false;
  selectedPlace: string = '';
  selectedTrajet: string = '';
  selectedDate: string | null = null;
  placeControl = new FormControl('');
  trajetControl = new FormControl('');
  dateControl = new FormControl('');
  @Output() filterChanged: EventEmitter<string> = new EventEmitter<string>();

  onSearch(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const value = inputElement.value?.toLowerCase() || '';
    this.filterChanged.emit(value);
  }

  applyFilters() {
    const filters = {
      place: this.placeControl.value,
      trajet: this.trajetControl.value,
      date: this.dateControl.value,
    };
    console.log('Recherche avec filtres :', filters);
    this.dismiss();
  }


  ngOnInit() {}
  constructor() {
    addIcons({filterOutline,closeOutline
  });
}

  enterAnimation = (baseEl: HTMLElement) => {
    const root = baseEl.shadowRoot;

    const backdropAnimation = this.animationCtrl
      .create()
      .addElement(root!.querySelector('ion-backdrop')!)
      .fromTo('opacity', '0.01', 'var(--backdrop-opacity)');

    const wrapperAnimation = this.animationCtrl
      .create()
      .addElement(root!.querySelector('.modal-wrapper')!)
      .keyframes([
        { offset: 0, opacity: '0', transform: 'scale(0)' },
        { offset: 1, opacity: '0.99', transform: 'scale(1)' },
      ]);

    return this.animationCtrl
      .create()
      .addElement(baseEl)
      .easing('ease-out')
      .duration(500)
      .addAnimation([backdropAnimation, wrapperAnimation]);
  };

  leaveAnimation = (baseEl: HTMLElement) => {
    return this.enterAnimation(baseEl).direction('reverse');
  };
  dismiss() {
    this.modalCtrl.dismiss();
  }
}
