import { PipeTransform, Pipe } from '@angular/core'

@Pipe({
  name: 'filterAbm'
})
export class FilterAbm implements PipeTransform {

  transform(any : any[], palabra: string): any[] {
    return any.filter(it => it.contiene(palabra))
  }

}