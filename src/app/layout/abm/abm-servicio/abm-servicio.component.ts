import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ServicioService } from 'src/app/services/servicio.service';
import { Location } from '@angular/common';


@Component({
  selector: 'app-abm-servicio',
  templateUrl: './abm-servicio.component.html',
})
export class AbmServicioComponent implements OnInit {

  buscar = ''
  listaItems : Array<any> = []
  cantidadRegistros : number=0
  paginaActual : number = 0
  cantidadPaginas : number[] = []
  realizoBusqueda : Boolean = true

  nombreItemModal = ""
  tituloModal = ""
  botonModal = ""


  constructor(private servicioService : ServicioService, private router : Router, private location : Location) { }

  async ngOnInit(): Promise<void> {
    this.inicializarListaItems()
  }

  async inicializarListaItems(){
    this.updatePalabraBuscar(this.buscar)
    this.paginaCero()

    if(this.buscar == ""){
      this.listaItems = await this.servicioService.getAllServicioByEmpresaId(this.paginaActual)
      this.cantidadRegistros = await this.servicioService.getCantidadServicio()
    }else{
      this.listaItems = await this.servicioService.getAllServicioFiltrados(this.paginaActual,this.buscar)
      this.cantidadRegistros = await this.servicioService.cantServicioFiltrados(this.buscar)
    }

    this.cantidadPaginas = new Array<number>(Math.ceil(this.cantidadRegistros / 10))
    
    this.tituloModal = "Eliminar Servicio"
    this.nombreItemModal = "servicio"
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

  editar(id : number){
    this.servicioService.servicioId = id
    this.router.navigateByUrl('/save' + this.location.path().substring(4, this.location.path().length + 1))
  }

  async eliminar(id : number){
    (await this.servicioService.delete(id)).subscribe({
      complete: () => {
        this.inicializarListaItems()
      }
    })
  }

}
