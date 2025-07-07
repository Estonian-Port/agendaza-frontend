import { PipeTransform, Pipe } from '@angular/core'

@Pipe({
  name: 'formatEnum'
})
export class FormatEnum implements PipeTransform {

 transform(value: string): string {
  if (!value) return '';

    const words = value.toLowerCase().split('_');

    if (words[0] === 'senia') {
      words[0] = 'Seña';
    } else {
      words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1);
    }

  return words.join(' ');
  }
}