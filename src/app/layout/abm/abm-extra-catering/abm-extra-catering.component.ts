import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as _ from 'lodash';
import { ExtraService } from 'src/app/services/extra.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-extra-abm-catering',
  templateUrl: './abm-extra-catering.component.html',
})
export class AbmExtraCateringComponent implements OnInit {
  buscar = ''
  listaItems : Array<any> = []
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
      this.listaItems = await this.extraService.getAllExtraCATByEmpresaId(this.paginaActual)
      this.cantidadRegistros = await this.extraService.cantExtrasCAT()
    }else{
      this.listaItems = await this.extraService.getAllExtraCATByFilterName(this.paginaActual,this.buscar)
      this.cantidadRegistros = await this.extraService.cantExtrasCATFiltrados(this.buscar)
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

  updatePaginaActual(page : number){
    this.paginaActual = page
    this.inicializarListaItems()
  }

  updatePrimeraBusqueda(busqueda: Boolean){
    this.realizoBusqueda = busqueda
  }

  updateCantidadPaginas(cantidadPaginas: number[]){
    this.cantidadPaginas = cantidadPaginas
  }

  precio(id : number){
    this.extraService.extraId = id
    this.extraService.extraVolver = this.location.path()
    this.router.navigateByUrl('/precioExtra')
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