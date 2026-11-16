import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-abm-cliente',
  templateUrl: './abm-cliente.component.html',
})
export class AbmClienteComponent implements OnInit {

  buscar = ''
  listaItems : Array<any> = []
  listaHeader : Array<any> =[]
  cantidadRegistros : number=0
  paginaActual : number = 0
  cantidadPaginas : number[] = []
  realizoBusqueda : Boolean = true
  cantidadEventos : number = 0

  constructor(private usuarioService : UsuarioService) { }

  async ngOnInit(): Promise<void> {
    this.inicializarListaItems()
  }

  async inicializarListaItems(){
    this.updatePalabraBuscar(this.buscar)

    try {
      this.listaItems = this.buscar === ''
        ? await this.usuarioService.getAllClientes(this.paginaActual)
        : await this.usuarioService.getClientesFiltrados(this.paginaActual, this.buscar);
    } catch (error) {
      if (!(error instanceof HttpErrorResponse) || error.status !== 404) {
        throw error;
      }
      this.listaItems = [];
    }

    this.cantidadRegistros = this.listaItems.length === 0
      ? 0
      : this.buscar === ''
        ? await this.usuarioService.getCantidadClientes()
        : await this.usuarioService.getCantidadClientesFiltrados(this.buscar);

    this.cantidadPaginas = new Array<number>(Math.ceil(this.cantidadRegistros / 10))

    this.listaHeader.push("Nombre")
    this.listaHeader.push("Apellido")
    this.listaHeader.push("Usuario")

    this.updateCantidadPaginas(this.cantidadPaginas)
  }

  paginaCero(){
    if(this.realizoBusqueda){
      this.paginaActual = 0
    }
    this.realizoBusqueda = false
  }

  updatePaginaActual(page : number){
    this.paginaActual = page
    this.inicializarListaItems()
  }

  updatePalabraBuscar(palabraBuscar: string){
    this.buscar = palabraBuscar
    this.paginaCero()
  }

  updateCantidadPaginas(cantidadPaginas: number[]){
    this.cantidadPaginas = cantidadPaginas
  }

}
