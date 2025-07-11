import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DateUtil } from 'src/app/model/DateUtil';
import { Time } from 'src/app/model/Time';

@Component({
  selector: 'app-hora-minutos',
  templateUrl: './hora-minutos.component.html'
})
export class HoraMinutosComponent {

  @Input()
  inicio! : Time

  @Input()
  fin! : Time

  @Input()
  hastaElOtroDiaCheckbox : boolean = false

  @Output()
  outputHastaElOtroDiaCheckbox = new EventEmitter<boolean>()

  listaHora : Array<string> = DateUtil.ListaHora
  listaMinuto : Array<string> = DateUtil.ListaMinuto

  changeCheckbox() {
    this.outputHastaElOtroDiaCheckbox.emit()
  }

}
