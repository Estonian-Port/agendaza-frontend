import { PipeTransform, Pipe } from '@angular/core'

@Pipe({
  name: 'filterAbm'
})
export class FilterAbm implements PipeTransform {

  transform(any : any[], currentRegistros: number = 0, search: string = ''): any[] {

    if(search.length != 0){
      return any.filter(it => it.contiene(search)).slice(currentRegistros, currentRegistros + 10)
      
    }
    return any.slice(currentRegistros, currentRegistros + 10)
  }

}