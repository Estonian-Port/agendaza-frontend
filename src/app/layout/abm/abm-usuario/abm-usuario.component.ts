import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Location } from '@angular/common';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-abm-usuario',
  templateUrl: './abm-usuario.component.html',
})
export class AbmUsuarioComponent implements OnInit {

  buscar = ''
  listaItems : Array<any> = []
  cantidadRegistros : number = 0
  paginaActual : number = 0
  cantidadPaginas : number[] = []
  realizoBusqueda : Boolean = true

  constructor(private usuarioService : UsuarioService, private loginService : LoginService, private router : Router, private location : Location) { }
  
  async ngOnInit(): Promise<void> {
    this.inicializarListaItems()
  }

  async inicializarListaItems(){
    this.updatePalabraBuscar(this.buscar)
    this.paginaCero()

    if(this.buscar == ""){
      this.listaItems = await this.usuarioService.getAllUsuario(this.paginaActual)
      this.cantidadRegistros = await this.usuarioService.getCantidadUsuario()
    }
    else {
      this.listaItems = await this.usuarioService.getAllUsuarioFiltrados(this.paginaActual,this.buscar)
      this.cantidadRegistros = await this.usuarioService.getCantidadUsuarioFiltrados(this.buscar)
    }

    this.cantidadPaginas = new Array<number>(Math.ceil(this.cantidadRegistros / 10))
    this.updateCantidadPaginas(this.cantidadPaginas)
  }

  paginaCero(){
    if(this.realizoBusqueda){
      this.paginaActual = 0
    }
    this.realizoBusqueda = false
  }

  updateCurrentRegistro(registro: number){
    this.paginaActual = registro
  }

  updatePaginaActual(pagina : number){
    this.paginaActual = pagina
    this.inicializarListaItems()
  }

  updatePalabraBuscar(palabraBuscar: string){
    this.buscar = palabraBuscar
  }

  updateCantidadPaginas(cantidadPaginas: number[]){
    this.cantidadPaginas = cantidadPaginas
  }

  editar(id : number){
    this.usuarioService.usuarioId = id
    this.router.navigateByUrl('/editUsuario')
  }

  async eliminar(id: number) {
    (await this.usuarioService.deleteCargo(id)).subscribe({
      complete: () => {
        this.inicializarListaItems()
      }
    })
  }

  cambiarPassword(id : number){
    this.usuarioService.usuarioId = id
    this.router.navigateByUrl('/editUsuarioPassword')
  }

  updatePrimeraBusqueda(busqueda: Boolean){
    this.realizoBusqueda = busqueda

  }
}
