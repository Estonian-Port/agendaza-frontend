import { Component, Input, OnInit } from '@angular/core';

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

  constructor() { }

  ngOnInit(): void {
  }
}
