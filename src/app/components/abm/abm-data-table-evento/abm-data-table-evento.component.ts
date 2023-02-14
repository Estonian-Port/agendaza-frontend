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
  outputPrecio = new EventEmitter<number>();

  @Output() 
  outputEditar = new EventEmitter<number>();

  @Output() 
  outputEliminar = new EventEmitter<number>();

  constructor() { }

  ngOnInit(): void {
  }

  precio(id : number){
    this.outputPrecio.emit(id);
  }

  editar(id : number){
    this.outputEditar.emit(id);
  }

  eliminar(id : number){
    this.outputEliminar.emit(id);
  }
}
