import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-abm-data-table-usuario',
  templateUrl: './abm-data-table-usuario.component.html',
  styleUrls: ['./abm-data-table-usuario.component.css']
})
export class AbmDataTableUsuarioComponent implements OnInit {

  
  @Input()
  listaItems : Array<any> = []

  @Input()
  listaHeader : Array<String> = []

  @Input()
  currentRegistro : number = 0

  @Input()
  buscar = ''

  @Output() 
  outputEditar = new EventEmitter<number>();

  @Output() 
  outputEditarPassword = new EventEmitter<number>();

  constructor() { }

  ngOnInit(): void {
  }

  editar(id : number){
    this.outputEditar.emit(id);
  }

  editarPassword(id : number){
    this.outputEditarPassword.emit(id);
  }
}
