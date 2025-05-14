import { Component, forwardRef, Injector, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR, NgControl, ReactiveFormsModule } from '@angular/forms';
import { IonInput, IonTextarea, IonDatetime, IonItem, IonIcon, IonSelect, IonSelectOption, IonSearchbar } from '@ionic/angular/standalone';
import { ControlType } from './form-field.enum.';
import { EventEmitter, Output } from '@angular/core';


@Component({
  selector: 'app-form-field',
  standalone: true,
  imports: [IonSearchbar,
    CommonModule,
    ReactiveFormsModule,
    IonInput,
    IonTextarea,
    IonDatetime,
    IonItem,
    IonIcon,
    IonSelect,
    IonSelectOption,
    IonSearchbar
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormFieldComponent),
      multi: true,
    },
  ],
  templateUrl: './form-field.component.html',
  styleUrls: ['./form-field.component.scss'],
})
export class FormFieldComponent implements ControlValueAccessor, OnInit {

  @Input() label!: string;
  @Input() placeholder!: string;
  @Input() type: string = 'text';
  @Input() controlType!: ControlType;;
  @Input() icon?: string;
  @Input() options: { label: string; value: any }[] = [];
  @Output() valueChange = new EventEmitter<any>();


  ControlType = ControlType;
  value: any;
 
  onChange = (value: any) => {};
  onTouched = () => {};

  formControl?: FormControl;

  constructor(private injector: Injector) {}

  ngOnInit() {
    const ngControl = this.injector.get(NgControl, null);
    if (ngControl) {
      ngControl.valueAccessor = this;
      this.formControl = ngControl.control as FormControl;
    }
  }

  writeValue(value: any): void {
    this.value = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setValue(event: any) {
    const newValue = event?.detail?.value;
    if (newValue !== this.value) {
      this.value = newValue;
      this.onChange(this.value);
    }
  }


  getErrorMessage(): string {
    if (!this.formControl) return '';

    const control = this.formControl;

    if (control.errors?.['required']) {
      return 'Ce champ est obligatoire.';
    }
    if (control.errors?.['email']) {
      return 'Veuillez entrer une adresse email valide.';
    }
    if (control.errors?.['minlength']) {
      const requiredLength = control.errors['minlength'].requiredLength;
      return `Minimum ${requiredLength} caractères.`;
    }
    return 'Champ invalide.';
  }
}
