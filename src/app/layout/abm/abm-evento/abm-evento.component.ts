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

  pagos(id : number){
    this.router.navigateByUrl('/editEventoPagos')
  }

  extras(id : number){
    this.router.navigateByUrl('/editEventoExtras')
  }

  catering(id : number){
    this.router.navigateByUrl('/editEventoCatering')
  }

  hora(id : number){
    this.router.navigateByUrl('/editEventoHora')
  }
  
  ver(id : number){
    this.router.navigateByUrl('/verEvento')
  }

  async eliminar(id : number){
    (await this.eventoService.delete(id)).subscribe({
      complete: () => {
        this.inicializarListaItems()
      }
    })
  }

}
