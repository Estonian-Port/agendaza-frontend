import { Component, Input, OnInit } from '@angular/core';

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

  constructor() { }

  ngOnInit(): void {
  }

}
