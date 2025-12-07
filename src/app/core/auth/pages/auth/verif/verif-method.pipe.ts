import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'verifMethod',
  standalone: true
})
export class VerifMethodPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}
