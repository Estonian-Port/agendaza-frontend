import { PipeTransform, Pipe } from '@angular/core'

@Pipe({
  name: 'formatNumero'
})
export class FormatNumero implements PipeTransform {

  transform(value: number | string): string {
    if (value === null || value === undefined) return ''
    
    const num = typeof value === 'number' ? value : parseFloat(value)
    if (isNaN(num)) return ''

    return num.toLocaleString('de-DE')
  }

}