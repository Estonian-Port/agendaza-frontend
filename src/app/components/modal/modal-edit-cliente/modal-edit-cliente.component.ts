import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { Cliente, ClienteUpdateDTO } from 'src/app/model/Usuario';

@Component({
  selector: 'app-modal-edit-cliente',
  templateUrl: './modal-edit-cliente.component.html'
})
export class ModalEditClienteComponent implements OnChanges {

  @Input()
  modal = false

  @Input()
  titulo = ""

  @Input()
  cliente = new Cliente(0, "", "", "", "", 0)

  clienteEditado = {
    id: 0,
    nombre: "",
    apellido: "",
    email: "",
    celular: "",
  }

  @Output() 
  outputChangeModal = new EventEmitter<boolean>();

  @Output() 
  outputSave = new EventEmitter<ClienteUpdateDTO>();

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['cliente'] || (changes['modal'] && this.modal)) {
      this.clienteEditado = {
        id: this.cliente.id,
        nombre: this.cliente.nombre,
        apellido: this.cliente.apellido,
        email: this.cliente.email,
        celular: this.cliente.celular ? String(this.cliente.celular) : "",
      }
    }
  }

  changeModal(){
    this.modal = !this.modal
    this.outputChangeModal.emit(this.modal)
  }

  save(){
    const celular = this.clienteEditado.celular.trim()
    this.outputSave.emit({
      id: this.cliente.id,
      nombre: this.clienteEditado.nombre,
      apellido: this.clienteEditado.apellido,
      email: this.clienteEditado.email,
      celular: celular ? Number(celular) : null,
    })
    this.changeModal()
  }

}
