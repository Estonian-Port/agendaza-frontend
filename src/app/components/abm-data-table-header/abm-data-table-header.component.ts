import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-abm-data-table-header',
  templateUrl: './abm-data-table-header.component.html',
  styleUrls: ['./abm-data-table-header.component.css']
})
export class AbmDataTableHeaderComponent implements OnInit {

  buscar = ''

  @Input()
  listaItems : Array<any> = []

  cantidadRegistros : number[] = []
  currentRegistro : number = 0

  cantidadPaginas : number[] = []
  currentPagina : number = 1

  classes : String = ""

  constructor(){}
  
  async ngOnInit() {
    
    this.cantidadRegistros = new Array<number>(this.listaItems.length)
    this.cantidadPaginas = new Array<number>(Math.trunc(this.listaItems.length / 10) + 1)
  }

  siguiente(){
    if(this.currentRegistro >= 0 && this.currentRegistro < (this.cantidadPaginas.length -1) * 10){
      this.currentRegistro += 10
      this.currentPagina += 1
    }
  }

  atras(){
    if(this.currentRegistro > 0 && this.currentRegistro <= (this.cantidadPaginas.length -1) * 10){
      this.currentRegistro -= 10
      this.currentPagina -= 1
    }
  }

  irPagina(pagina : number){
    this.currentRegistro = (pagina - 1 ) * 10
    this.currentPagina = pagina
  }

  actualizarCantidadPaginas(){
    this.currentPagina = 1
    this.currentRegistro = 0
    this.cantidadPaginas = new Array<number>(
      Math.trunc(
        this.listaItems.filter(it => it.contiene(this.buscar)).length / 10) + 1)
  }

}
