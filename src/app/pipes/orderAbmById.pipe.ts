import { Pipe, PipeTransform } from '@angular/core'

@Pipe({
  name: 'orderAbmById'
})
export class OrderAbmById implements PipeTransform {

  transform(any: any[]): any[] {
    return any.sort((item, otroItem) => item.id - otroItem.id)
  }

}