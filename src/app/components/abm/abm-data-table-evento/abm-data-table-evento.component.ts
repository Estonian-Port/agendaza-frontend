import { Component, Input, OnInit } from '@angular/core';

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

  constructor() { }

  ngOnInit(): void {
  }

}
