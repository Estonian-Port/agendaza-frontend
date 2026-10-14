import { Component, EventEmitter, Input, Output } from '@angular/core';
import * as _ from 'lodash';
import { Extra } from 'src/app/model/Extra';

@Component({
  selector: 'app-extra-checkbox',
  templateUrl: './extra-checkbox.component.html'
})
export class ExtraCheckboxComponent {

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

  modalEditarPrecio = false
  tituloModalPrecio = ""
  inputPrecioEditar: any = 0
  metodoAceptarPrecio!: Function

  editarPrecio() {
    this.tituloModalPrecio = `Editar precio de ${this.extra.nombre}`
    this.inputPrecioEditar = this.extra.precio
    this.metodoAceptarPrecio = this.guardarPrecio.bind(this)
    this.modalEditarPrecio = true
  }

  guardarPrecio() {
    const precioAnterior = Number(this.extra.precio) || 0
    this.extra.precio = Math.max(0, Number(this.inputPrecioEditar) || 0)
    if (this.isChecked()) {
      this.outputExtraPresupuesto.emit(this.extra.precio - precioAnterior)
    }
  }

  setInputPrecioEditar(precio: number) {
    this.inputPrecioEditar = precio
  }

  setModalEditarPrecio(modal: boolean) {
    this.modalEditarPrecio = modal
  }

  onCheckboxChange(event: any){
    this.listaExtra ??= []
    if (event.target.checked) {
      this.listaExtra.push(this.extra)
      this.outputExtraPresupuesto.emit(this.extra.precio)
      this.outputExtraOtro.emit()
    } else {
      _.pull(this.listaExtra, this.listaExtra.find(it => { return it.id === this.extra.id }))
      this.outputExtraPresupuesto.emit(- this.extra.precio)
    }
  }

  isChecked(){
    return (this.listaExtra ?? []).some(it => it.id === this.extra.id)
  }
}
