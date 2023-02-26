import { Pipe, PipeTransform } from '@angular/core'
import { PrecioForm } from '../model/Precio'

@Pipe({
  name: 'orderByFechaDescePrecio',
  pure: false
})
export class OrderByFechaDesdePrecio implements PipeTransform {

  transform(any: any[]): any[] {
    //   return any.sort(
    //     function (item, otroItem) {
    //       const  n = item.year - otroItem.year;
    //       if (n !== 0) {
    //           return n;
    //       }
    //       return item.desde - item.desde;
    //     }
    //  }
    // return any.sort((item, otroItem) => item.year - otroItem.year || item.desde - otroItem.desde)
    return any.sort((item, otroItem) => item.year - otroItem.year)
  }

}