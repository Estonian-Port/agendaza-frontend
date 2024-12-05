import { Component, OnInit } from '@angular/core';
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

    if(this.buscar == ""){
      this.listaItems = await this.usuarioService.getAllCliente(this.paginaActual)
      this.cantidadRegistros = await this.usuarioService.getCantidadCliente()
    }
    else {
      this.listaItems = await this.usuarioService.getAllClienteFiltrados(this.paginaActual,this.buscar)
      this.cantidadRegistros = await this.usuarioService.getCantidadClienteFiltrados(this.buscar)
    }

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
