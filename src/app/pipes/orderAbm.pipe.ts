import { Pipe, PipeTransform } from '@angular/core'

@Pipe({
  name: 'orderAbm'
})
export class OrderAbm implements PipeTransform {

  transform(any: any[]): any[] {
    return any.sort((item, otroItem) => item.id - otroItem.id)
  }

}