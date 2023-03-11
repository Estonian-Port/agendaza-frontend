import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

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

  constructor() { }

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

  eliminar(id : number){
    this.outputEliminar.emit(id);
  }
}
