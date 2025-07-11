import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EventoService } from 'src/app/services/evento.service';

@Component({
  selector: 'app-abm-evento',
  templateUrl: './abm-evento.component.html',
})
export class AbmEventoComponent implements OnInit {

  buscar = ''
  listaItems : Array<any> = []
  listaHeader : Array<any> =[]
  cantidadRegistros : number = 0
  realizoBusqueda: Boolean = false
  cantidadPaginas : number[] = []
  paginaActual : number = 0
  cantidadEventos : number = 0

  constructor(private eventoService : EventoService, private router : Router) { }

  async ngOnInit(): Promise<void> {
    if(this.eventoService.paginaActual !=0){
      this.paginaActual = this.eventoService.paginaActual
    }
    this.inicializarListaItems()
  }

  async inicializarListaItems(){

    this.paginaCero()

    if(this.eventoService.fechaFiltroForAbmEvento != ""){
      this.listaItems = await this.eventoService.getAllEventosByFecha()
      // TODO cantidad de registros de ese dia
    }else if(this.buscar == ""){
      this.listaItems = await this.eventoService.getAllEventoByEmpresaId(this.paginaActual)
      this.cantidadEventos = await this.eventoService.cantEventos()
    }else{
      this.listaItems = await this.eventoService.getAllEventoByFilterName(this.paginaActual,this.buscar)
      this.cantidadEventos = await this.eventoService.cantEventosFiltrados(this.buscar)
    }

    this.cantidadRegistros = this.cantidadEventos
    this.cantidadPaginas = new Array<number>(Math.ceil(this.cantidadRegistros / 10))
    
    this.updateCantidadPaginas(this.cantidadPaginas)
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

  updatePalabraBuscar(palabraBuscar: string){
    this.buscar = palabraBuscar
    this.paginaCero()
  }
  
  updateCantidadPaginas(cantidadPaginas: number[]){
    this.cantidadPaginas = cantidadPaginas
  }

  pagos(){
    this.guardarPaginaActual()
    this.router.navigateByUrl('/editEventoPagos')
  }

  extras(){
    this.guardarPaginaActual()
    this.router.navigateByUrl('/editEventoExtras')
  }

  catering(){
    this.guardarPaginaActual()
    this.router.navigateByUrl('/editEventoCatering')
  }

  hora(){
    this.guardarPaginaActual()
    this.router.navigateByUrl('/editEventoHora')
  }
  
  ver(){
    this.guardarPaginaActual()
    this.router.navigateByUrl('/verEvento')
  }

  async eliminar(id : number){
    (await this.eventoService.delete(id)).subscribe({
      complete: () => {
        this.inicializarListaItems()
      }
    })
  }

  guardarPaginaActual(){
    this.eventoService.paginaActual = this.paginaActual
  }
}
