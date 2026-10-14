import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import * as _ from 'lodash';
import { ExtraVariable } from 'src/app/model/Extra';

@Component({
  selector: 'app-extra-variable-checkbox',
  templateUrl: './extra-variable-checkbox.component.html'
})
export class ExtraVariableCheckboxComponent implements OnInit {

  @Input()
  i! : number

  @Input()
  extra! : ExtraVariable

  @Input()
  listaExtra! : Array<ExtraVariable>

  precioExtraPasado : number = 0
  modalEditarPrecio = false
  tituloModalPrecio = ""
  inputPrecioEditar: any = 0
  metodoAceptarPrecio!: Function

  @Output()
  outputExtraPresupuesto = new EventEmitter<number>();
  
  constructor() { }

  ngOnInit(): void {
    this.extra.cantidad = (this.listaExtra ?? []).find(it => it.id === this.extra.id)?.cantidad ?? 0
    this.precioExtraPasado = this.isChecked() ? this.extra.precio * this.extra.cantidad : 0
  }

  editarPrecio() {
    this.tituloModalPrecio = `Editar precio de ${this.extra.nombre}`
    this.inputPrecioEditar = this.extra.precio
    this.metodoAceptarPrecio = this.guardarPrecio.bind(this)
    this.modalEditarPrecio = true
  }

  guardarPrecio() {
    this.extra.precio = Math.max(0, Number(this.inputPrecioEditar) || 0)
    if (this.isChecked()) {
      const nuevoTotal = this.extra.precio * this.extra.cantidad
      this.outputExtraPresupuesto.emit(nuevoTotal - this.precioExtraPasado)
      this.precioExtraPasado = nuevoTotal
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
      this.precioExtraPasado = this.extra.precio * this.extra.cantidad
      this.outputExtraPresupuesto.emit(this.precioExtraPasado)
    } else {
      this.onNotCheckbox()
      _.pull(this.listaExtra, this.listaExtra.find(it => { return it.id === this.extra.id }))
    }
  }

  onChangeCantidad(){
    if(this.isChecked()){
      this.onChangeCantidadCheckbox()
      this.outputExtraPresupuesto.emit(this.extra.precio * this.extra.cantidad)
      this.precioExtraPasado = this.extra.precio * this.extra.cantidad
    }
  }

  onNotCheckbox(){
    this.outputExtraPresupuesto.emit(-this.precioExtraPasado)
    this.precioExtraPasado = 0
    this.extra.cantidad = 0
  }

  onChangeCantidadCheckbox(){
    this.outputExtraPresupuesto.emit(-this.precioExtraPasado)
  }

  isChecked(){
    return (this.listaExtra ?? []).some(it => it.id === this.extra.id)
  }
}
