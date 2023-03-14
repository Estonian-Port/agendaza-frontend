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
  listaExtra! : Array<Extra>

  @Output()
  outputExtraPresupuesto = new EventEmitter<number>();

  @Output()
  outputExtraOtro = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  onCheckboxChange(event: any){
    if (event.target.checked) {
      this.listaExtra.push(this.extra)
      this.outputExtraPresupuesto.emit(this.extra.precio)
      this.outputExtraOtro.emit()
    } else {
      console.log(this.listaExtra)
      _.pull(this.listaExtra, this.listaExtra.find(it => { return it.id === this.extra.id }))
      console.log(this.listaExtra)
      this.outputExtraPresupuesto.emit(- this.extra.precio)
    }
  }

  isChecked(id : number){
    return this.listaExtra.find(it => { return it.id === this.extra.id }) != undefined
  }
}
