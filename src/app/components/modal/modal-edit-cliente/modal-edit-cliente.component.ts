import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Cliente } from 'src/app/model/Usuario';

@Component({
  selector: 'app-modal-edit-cliente',
  templateUrl: './modal-edit-cliente.component.html'
})
export class ModalEditClienteComponent {

  @Input()
  modal = false

  @Input()
  titulo = ""

  @Input()
  cliente = new Cliente(0, "", "", "", "", 0)

  @Output() 
  outputChangeModal = new EventEmitter<boolean>();

  @Output() 
  outputSave = new EventEmitter<any>();

  changeModal(){
    this.modal = !this.modal
    this.outputChangeModal.emit(this.modal)
  }

  save(){
    this.outputSave.emit(this.cliente)
    this.changeModal()
  }

}
