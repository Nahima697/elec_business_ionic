import { Component } from '@angular/core';

@Component({
  selector: 'app-accordeon',
  standalone:true,
  imports: [],
  templateUrl: './accordeon.component.html',
  styleUrl: './accordeon.component.css'
})
export class AccordeonComponent {

  openIndexes:number[]=[];

  toggle(index:number):void {
    const idx= this.openIndexes.indexOf(index);

    if(idx ===-1) {
      this.openIndexes.push(index);
    }

    else {
      this.openIndexes.splice(idx,1)
    }

  }

  isOpen(index:number) {
    return this.openIndexes.includes(index);
  }
}
