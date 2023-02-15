import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-abm-data-table-pago',
  templateUrl: './abm-data-table-pago.component.html',
  styleUrls: ['./abm-data-table-pago.component.css']
})
export class AbmDataTablePagoComponent implements OnInit {


  @Input()
  listaItems : Array<any> = []

  @Input()
  currentRegistro : number = 0

  @Input()
  buscar = ''

  @Output() 
  outputEliminar = new EventEmitter<number>();

  constructor() { }

  ngOnInit(): void {
  }

  eliminar(id : number){
    this.outputEliminar.emit(id);
  }
}
