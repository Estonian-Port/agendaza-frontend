import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-modal-editar',
  templateUrl: './modal-editar.component.html'
})
export class ModalEditarComponent implements OnInit {

  @Input()
  modal = false

  @Input()
  titulo = ""

  @Input()
  inputEditar = ""

  @Output() 
  outputAceptar = new EventEmitter<string>();

  @Output() 
  outputChangeModal = new EventEmitter<boolean>();

  constructor() { }

  ngOnInit(): void {
  }

  changeModal(){
    this.modal = !this.modal
    this.outputChangeModal.emit(this.modal)
  }

  aceptar(){
    this.outputAceptar.emit(this.inputEditar);
    this.changeModal()
  }
}
