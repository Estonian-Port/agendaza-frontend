import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ExtraService } from 'src/app/services/extra.service';
import { Location } from '@angular/common';
import { Extra } from 'src/app/model/Extra';

@Component({
  selector: 'app-abm-extra-evento',
  templateUrl: './abm-extra-evento.component.html',
})
export class AbmExtraEventoComponent implements OnInit {

  buscar = ''
  listaItems : Array<Extra> = []
  cantidadRegistros : number=0
  paginaActual : number = 0
  cantidadPaginas : number[] = []
  realizoBusqueda : Boolean = true

  nombreItemModal = ""
  tituloModal = ""
  botonModal = ""

  constructor(private extraService : ExtraService, private router : Router, private location : Location) { }

  async ngOnInit(): Promise<void> {
    this.inicializarListaItems()
  }

  async inicializarListaItems(){

    this.updatePalabraBuscar(this.buscar)
    this.paginaCero()
    
    if(this.buscar == ""){
      this.listaItems = await this.extraService.getAllExtraByEmpresaId(this.paginaActual)
      this.cantidadRegistros = await this.extraService.cantExtras()
    }else{
      this.listaItems = await this.extraService.getAllExtraByFilterName(this.paginaActual,this.buscar)
      this.cantidadRegistros = await this.extraService.cantExtrasFiltrados(this.buscar)
    }
    
    this.cantidadPaginas = new Array<number>(Math.ceil(this.cantidadRegistros / 10))
    this.updateCantidadPaginas(this.cantidadPaginas)
    
    this.tituloModal = "Eliminar Extra"
    this.nombreItemModal = "extra"
    this.botonModal = "Eliminar"
  }

  paginaCero(){
    if(this.realizoBusqueda){
      this.paginaActual = 0
    }
    this.realizoBusqueda = false
  }

  updatePalabraBuscar(palabraBuscar: string){
    this.buscar = palabraBuscar
  }

  updateCantidadPaginas(cantidadPaginas: number[]){
    this.cantidadPaginas = cantidadPaginas
  }

  precio(id : number){
    this.extraService.extraId = id
    this.extraService.extraVolver = this.location.path()
    this.router.navigateByUrl('/precioExtra')
  }

  updatePaginaActual(pagina : number){
    this.paginaActual = pagina
    this.inicializarListaItems()
  }

  updatePrimeraBusqueda(busqueda: Boolean){
    this.realizoBusqueda = busqueda
  }

  editar(id : number){
    this.extraService.extraId = id
    this.router.navigateByUrl('/save' + this.location.path().substring(4, this.location.path().length + 1))
  }

  async eliminar(id : number){
    (await this.extraService.delete(id)).subscribe({
      complete: () => {
        this.inicializarListaItems()
      }
    })
  }
}
