import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { EventoService } from 'src/app/services/evento.service';

@Component({
  selector: 'app-abm-data-table-evento',
  templateUrl: './abm-data-table-evento.component.html'
})
export class AbmDataTableEventoComponent implements OnInit {
  
  @Input()
  listaItems : Array<any> = []

  @Input()
  listaHeader : Array<String> = []

  @Input()
  buscar = ''

  modal = false

  idEliminar = 0

  cuerpoModal = ""

  tituloModal = "Eliminar Modal"

  botonModal = "Eliminar"

  @Output() 
  outputPagos = new EventEmitter<number>();

  @Output() 
  outputExtra = new EventEmitter<number>();

  @Output() 
  outputCatering = new EventEmitter<number>();

  @Output() 
  outputHora = new EventEmitter<number>();

  @Output() 
  outputVer = new EventEmitter<number>();

  @Output() 
  outputEliminar = new EventEmitter<number>();

  constructor(private eventoService : EventoService) { }

  ngOnInit(): void {
  }

  pagos(id : number){
    this.outputPagos.emit(id);
  }

  extras(id : number){
    this.outputExtra.emit(id);
  }

  catering(id : number){
    this.outputCatering.emit(id);
  }

  hora(id : number){
    this.outputHora.emit(id);
  }
  
  ver(id : number){
    this.outputVer.emit(id);
  }

  eliminar(){
    this.outputEliminar.emit(this.idEliminar);
  }

  modalParaEliminar(id : number, nombre : string){
    this.idEliminar = id
    this.cuerpoModal = "Quiere eliminar el Evento: " + nombre
    this.setModal(!this.modal)
  }

  setModal(modal : boolean){
    this.modal = modal
  }
}
