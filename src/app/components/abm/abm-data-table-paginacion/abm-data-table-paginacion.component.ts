import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-abm-data-table-paginacion',
  templateUrl: './abm-data-table-paginacion.component.html',
  styleUrls: ['./abm-data-table-paginacion.component.css']
})
export class AbmDataTablePaginacionComponent {

  @Input()
  paginaActual! : number

  @Input()
  listaItems : Array<any> = []
  
  @Input()
  cantidadPaginas : number[] = []

  @Input()
  cantidadRegistros! : number

  @Input()
  cantidadEventos! : number

  @Output() 
  outputPaginaActual = new EventEmitter<number>();

  constructor(){}

  siguiente(){
      if(this.paginaActual < this.cantidadRegistros/10 -1){
        this.paginaActual += 1
      }
      this.updatePaginaActual()
  }

  atras(){
      if(this.paginaActual > 0){
        this.paginaActual -= 1
      }
      this.updatePaginaActual()
  }

  irPagina(pagina : number){
    this.paginaActual = pagina
    this.updatePaginaActual()
  }

  getPaginaMitadSuperior(): number {
    return Math.round((this.cantidadPaginas.length - this.paginaActual) * 1/2) + this.paginaActual
  }

  getPaginaMitadInferior(): number{
    return Math.round(1/2 * this.paginaActual)
  }
  
  actualizarCantidadPaginas(){
    this.paginaActual = 0
  }
  
  updatePaginaActual() {
    this.outputPaginaActual.emit(this.paginaActual);
  }

  getLimites(paginaActual: number): [number, number] {
    const fin = Math.max(5,paginaActual)
    const inicio = Math.max(0,fin-5) + 1
    return [inicio, fin];
  }
  
  getInicio(): number {
    var fin = Math.max(4,this.paginaActual)
    var inicio = fin - 3
    return inicio
  }

  getPaginacionIntermedia(): number[] {
    let paginas: number[] = [];

    // Si la página es 1, mostramos las primeras 5 páginas
    if (this.paginaActual < 5) {
        paginas = [1, 2, 3, 4];
    }
    // Si estamos entre la página 5 y 5 antes del final
    else if (this.paginaActual >= 4 && this.paginaActual < this.cantidadPaginas.length - 5) {
        paginas = [this.paginaActual - 1, this.paginaActual, this.paginaActual + 1];
    }
    // Si estamos cerca del final, mostramos las últimas 5 páginas
    else if (this.paginaActual >= this.cantidadPaginas.length - 5) {
        paginas = [
            this.cantidadPaginas.length - 5,
            this.cantidadPaginas.length - 4,
            this.cantidadPaginas.length - 3,
            this.cantidadPaginas.length - 2,
        ];
    }
    return paginas;
}


}