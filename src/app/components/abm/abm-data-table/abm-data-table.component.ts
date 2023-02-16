import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-abm-data-table',
  templateUrl: './abm-data-table.component.html',
  styleUrls: ['./abm-data-table.component.css']
})
export class AbmDataTableComponent implements OnInit {
  
  @Input()
  listaItems : Array<any> = []

  @Input()
  currentRegistro : number = 0

  @Input()
  buscar = ''

  @Input()
  mostrarPrecio : boolean = true

  @Output() 
  outputPrecio = new EventEmitter<number>();

  @Output() 
  outputEditar = new EventEmitter<number>();

  @Output() 
  outputEliminar = new EventEmitter<number>();

  modal = false
  idEliminar = 0
  cuerpoModal = ""
  tituloModal = ""
  botonModal = ""

  constructor() { }

  ngOnInit(): void {
  }

  modalParaEliminar(id : number, nombre : string){
    this.idEliminar = id
    this.tituloModal = "Eliminar Servicio"
    this.cuerpoModal = "Quiere eliminar el servicio: " + nombre
    this.botonModal = "Eliminar"
    this.setModal(!this.modal)
  }

  setModal(modal : boolean){
    this.modal = modal
  }

  precio(id : number){
    this.outputPrecio.emit(id);
  }

  editar(id : number){
    this.outputEditar.emit(id);
  }

  eliminar(id : number){
    this.outputEliminar.emit(this.idEliminar);
  }

}
