import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TipoEventoService } from 'src/app/services/tipo-evento.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-abm-tipo-evento',
  templateUrl: './abm-tipo-evento.component.html',
})
export class AbmTipoEventoComponent implements OnInit {

  buscar = ''
  listaItems : Array<any> = []
  cantidadRegistros : number = 0
  paginaActual : number = 0
  cantidadPaginas : number[] = []
  realizoBusqueda : Boolean = true

  nombreItemModal = ""
  tituloModal = ""
  botonModal = ""

  constructor(private tipoEventoService : TipoEventoService, private router : Router, private location : Location) { }

  async ngOnInit(): Promise<void> {
    this.inicializarListaItems()
  }

  async inicializarListaItems(){
    this.updatePalabraBuscar(this.buscar)
    this.paginaCero()

    if(this.buscar == ""){
      this.listaItems = await this.tipoEventoService.getAllTipoEventoByEmpresaIdAbm(this.paginaActual)
      this.cantidadRegistros = await this.tipoEventoService.getCantidadTipoEvento()
    }else{
      this.listaItems = await this.tipoEventoService.getAllTipoEventoFiltrados(this.paginaActual,this.buscar)
      this.cantidadRegistros = await this.tipoEventoService.cantTipoEventoFiltrados(this.buscar)
    }

    this.cantidadPaginas = new Array<number>(Math.ceil(this.cantidadRegistros / 10))
    
    this.tituloModal = "Eliminar Tipo Evento"
    this.nombreItemModal = "tipo evento"
    this.botonModal = "Eliminar"
  }

  paginaCero(){
    if(this.realizoBusqueda){
      this.paginaActual = 0
    }
    this.realizoBusqueda = false
  }

  updatePaginaActual(pagina : number){
    this.paginaActual = pagina
    this.inicializarListaItems()
  }

  updatePrimeraBusqueda(busqueda: Boolean){
    this.realizoBusqueda = busqueda
  }
  
  updatePalabraBuscar(palabraBuscar: string){
    this.buscar = palabraBuscar
  }

  updateCantidadPaginas(cantidadPaginas: number[]){
    this.cantidadPaginas = cantidadPaginas
  }

  precio(id : number){
    this.router.navigate(['/precio' + this.location.path().substring(4, this.location.path().length + 1)], { queryParams: { tipoEventoId: id } })
  }

  editar(id : number){
    this.router.navigate(['/save' + this.location.path().substring(4, this.location.path().length + 1)], { queryParams: { tipoEventoId: id } })
  }

  async eliminar(id: number): Promise<void> {
    try {
      await this.tipoEventoService.delete(id)
      await this.inicializarListaItems();
    } catch (error) {
      console.error('Error al eliminar el tipo evento:', error);
    }
  }

}
