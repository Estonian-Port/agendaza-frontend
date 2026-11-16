import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import * as _ from 'lodash';
import { ExtraService } from 'src/app/services/extra.service';
import { Location } from '@angular/common';
import { Extra } from 'src/app/model/Extra';

@Component({
  selector: 'app-extra-abm-catering',
  templateUrl: './abm-extra-catering.component.html',
})
export class AbmExtraCateringComponent implements OnInit {
  
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

  async inicializarListaItems(actualizarCantidad = true){

    this.updatePalabraBuscar(this.buscar)
    this.paginaCero()
    
    try {
      this.listaItems = this.buscar === ''
        ? await this.extraService.getAllExtraCateringByEmpresaId(this.paginaActual)
        : await this.extraService.getAllExtraCateringFilter(this.paginaActual, this.buscar);
    } catch (error) {
      if (!(error instanceof HttpErrorResponse) || error.status !== 404) {
        throw error;
      }
      this.listaItems = [];
    }

    if (actualizarCantidad) {
      this.cantidadRegistros = this.listaItems.length === 0
        ? 0
        : this.buscar === ''
          ? await this.extraService.cantExtraCatering()
          : await this.extraService.cantExtraCateringFilter(this.buscar);
    }

    if(actualizarCantidad){
      this.cantidadPaginas = new Array<number>(Math.ceil(this.cantidadRegistros / 10))
      this.updateCantidadPaginas(this.cantidadPaginas)
    }

    this.tituloModal = "Eliminar Catering"
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
    this.router.navigate(['/precioExtra'], { queryParams: { extraId: id } })
  }

  updatePaginaActual(pagina : number){
    const actualizarCantidad = this.realizoBusqueda === true
    this.paginaActual = pagina
    this.inicializarListaItems(actualizarCantidad)
  }

  updatePrimeraBusqueda(busqueda: Boolean){
    this.realizoBusqueda = busqueda
  }

  editar(id : number){
    this.router.navigate(['/save' + this.location.path().substring(4, this.location.path().length + 1)], { queryParams: { extraId: id } })
  }

  async eliminar(id : number){
    (await this.extraService.delete(id)).subscribe({
      complete: () => {
        this.inicializarListaItems()
      }
    })
  }

}