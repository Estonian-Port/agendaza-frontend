import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import * as _ from 'lodash';
import { Extra } from 'src/app/model/Extra';
import { GenericItem } from 'src/app/model/GenericItem';

@Component({
  selector: 'app-extra-checkbox',
  templateUrl: './extra-checkbox.component.html',
  styleUrls: ['./extra-checkbox.component.css']
})
export class ExtraCheckboxComponent implements OnInit {

  @Input()
  i! : number

  @Input()
  extra! : Extra

  @Input()
  listaExtra! : Array<number>

  @Output()
  outputExtraPresupuesto = new EventEmitter<number>();

  @Output()
  outputExtraOtro = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  onCheckboxChange(event: any){
    if (event.target.checked) {
      this.listaExtra.push(Number(event.target.value))
      this.outputExtraPresupuesto.emit(this.extra.precio)
      this.outputExtraOtro.emit()
    } else {
      _.pull(this.listaExtra, Number(event.target.value))
      this.outputExtraPresupuesto.emit(- this.extra.precio)
    }
  }

  isChecked(id : number){
    return this.listaExtra.indexOf(id) > -1
  }
}
