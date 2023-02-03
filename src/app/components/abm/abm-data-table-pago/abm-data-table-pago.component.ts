import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-abm-data-table-pago',
  templateUrl: './abm-data-table-pago.component.html',
  styleUrls: ['./abm-data-table-pago.component.css']
})
export class AbmDataTablePagoComponent implements OnInit {


  @Input()
  listaItems : Array<any> = []

  @Input()
  listaHeader : Array<String> = []

  @Input()
  currentRegistro : number = 0

  @Input()
  buscar = ''

  constructor() { }

  ngOnInit(): void {
  }
}
