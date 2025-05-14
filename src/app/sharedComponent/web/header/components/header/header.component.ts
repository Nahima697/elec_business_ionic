import { Component, inject } from '@angular/core';
import { FormFieldComponent } from 'src/app/sharedComponent/form-field/form-field.component';
import { STATION, Station } from 'src/app/sharedComponent/station/station.component';
import { ControlType } from 'src/app/sharedComponent/form-field/form-field.enum.';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [FormFieldComponent,RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  filteredStations: Station[] = [];
  stations: Station[] = STATION;
  ControlType = ControlType;

  private router = inject(Router);

  onLocalSearch(event: Event) {
    const inputElement = event.target as HTMLInputElement;

    const value = inputElement.value?.toLowerCase() || '';
    this.filteredStations = this.stations.filter(station =>
      station.nom.toLowerCase().includes(value) ||
      station.adresse.toLowerCase().includes(value)
    );
    console.log(this.filteredStations);
    if (this.filteredStations.length > 0) {
      this.router.navigate(['/map'], {
        state: { stations: this.filteredStations }
      });
    }


  }
}
