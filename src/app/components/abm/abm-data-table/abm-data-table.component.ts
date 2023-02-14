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
  listaHeader : Array<String> = []

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
