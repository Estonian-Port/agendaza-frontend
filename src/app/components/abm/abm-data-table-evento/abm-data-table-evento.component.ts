import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { EventoService } from 'src/app/services/evento.service';

@Component({
  selector: 'app-abm-data-table-evento',
  templateUrl: './abm-data-table-evento.component.html',
  styleUrls: ['./abm-data-table-evento.component.css']
})
export class AbmDataTableEventoComponent implements OnInit {
  
  @Input()
  listaItems : Array<any> = []

  @Input()
  listaHeader : Array<String> = []

  @Input()
  currentRegistro : number = 0

  @Input()
  buscar = ''

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
    this.setEventoId(id)
    this.outputPagos.emit(id);
  }

  extras(id : number){
    this.setEventoId(id)
    this.outputExtra.emit(id);
  }

  catering(id : number){
    this.setEventoId(id)
    this.outputCatering.emit(id);
  }

  hora(id : number){
    this.setEventoId(id)
    this.outputHora.emit(id);
  }
  
  ver(id : number){
    this.setEventoId(id)
    this.outputVer.emit(id);
  }

  eliminar(id : number){
    this.setEventoId(id)
    this.outputEliminar.emit(id);
  }

  setEventoId(id : number){
    this.eventoService.eventoId = id
  }
}
