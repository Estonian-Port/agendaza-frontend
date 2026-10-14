import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-modal-editar',
  templateUrl: './modal-editar.component.html'
})
export class ModalEditarComponent {

  @Input()
  modal = false

  @Input()
  titulo = ""

  @Input()
  inputEditar = ""

  @Input()
  myCallback!: Function

  @Input()
  formatoTextearea = false

  @Input()
  tipoInput = "text"

  @Output() 
  outputChangeModal = new EventEmitter<boolean>();

  @Output() 
  outputAceptar = new EventEmitter<any>();

  changeModal(){
    this.modal = !this.modal
    this.outputChangeModal.emit(this.modal)
  }

  aceptar(){
    this.outputAceptar.emit(this.inputEditar)
    this.myCallback()
    this.changeModal()
  }
}
