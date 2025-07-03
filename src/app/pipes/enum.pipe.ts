import { PipeTransform, Pipe } from '@angular/core'

@Pipe({
  name: 'enum'
})
export class Enum implements PipeTransform {

 transform(value: string): string {
    if (!value) return '';

    // Reemplaza guiones bajos por espacios, pasa a minúscula y capitaliza cada palabra
    return value
      .toLowerCase()
      .split('_')
      .map(word => {
        if (word === 'senia') return 'Seña';
        return word.charAt(0).toUpperCase() + word.slice(1);
      })
      .join(' ');
  }
}