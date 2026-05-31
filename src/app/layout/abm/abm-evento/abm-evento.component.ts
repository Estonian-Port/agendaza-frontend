import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EventoService } from 'src/app/services/evento.service';

@Component({
  selector: 'app-abm-evento',
  templateUrl: './abm-evento.component.html',
})
export class AbmEventoComponent implements OnInit {

  buscar = ''
  fechaFiltro = ''
  listaItems : Array<any> = []
  listaHeader : Array<any> = []
  cantidadRegistros : number = 0
  cantidadPaginas : number[] = []
  paginaActual : number = 0
  cantidadEventos : number = 0
  
constructor(
    private eventoService : EventoService,
    private router : Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.paginaActual = params['page'] ? Number(params['page']) : 0;
      
      this.fechaFiltro = params['fecha'] ? params['fecha'] : ''; 
      
      this.inicializarListaItems(); 
    });
  }

  async inicializarListaItems(){
    
    if(this.fechaFiltro != ""){
      this.listaItems = await this.eventoService.getAllEventosByFecha(this.fechaFiltro)
      this.cantidadEventos = this.listaItems.length // Ajusta esto si tu backend devuelve un total específico
    
    } else if(this.buscar == ""){
      this.listaItems = await this.eventoService.getAllEventoByEmpresaId(this.paginaActual)
      this.cantidadEventos = await this.eventoService.cantEventos()
    
    } else {
      this.listaItems = await this.eventoService.getAllEventoByFilterName(this.paginaActual, this.buscar)
      this.cantidadEventos = await this.eventoService.cantEventosFiltrados(this.buscar)
    }

    this.cantidadRegistros = this.cantidadEventos
    this.cantidadPaginas = new Array<number>(Math.ceil(this.cantidadRegistros / 10))
    
    this.updateCantidadPaginas(this.cantidadPaginas)
  }

  updatePaginaActual(pagina : number){
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { page: pagina },
      queryParamsHandling: 'merge'
    });
  }

  updatePalabraBuscar(palabraBuscar: string){
    this.buscar = palabraBuscar
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { page: 0 },
      queryParamsHandling: 'merge'
    });
  }
  
  updateCantidadPaginas(cantidadPaginas: number[]){
    this.cantidadPaginas = cantidadPaginas
  }

  pagos(id: number){
    this.router.navigate(['/editEventoPagos', id]);
  }

  extras(id: number){
    this.router.navigate(['/editEventoExtras', id]);
  }

  catering(id: number){
    this.router.navigate(['/editEventoCatering', id]);
  }

  hora(id: number){
    this.router.navigate(['/editEventoHora', id]);
  }
  
  ver(id: number){
    this.router.navigate(['/verEvento', id]); 
  }

  async eliminar(id: number) {
    try {
      await this.eventoService.delete(id);
      this.inicializarListaItems();
    } catch (error) {
      console.error('Error al eliminar el evento:', error);
    }
  }
}