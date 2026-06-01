import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { EventoService } from 'src/app/services/evento.service';

@Component({
  selector: 'app-abm-evento',
  templateUrl: './abm-evento.component.html',
})
export class AbmEventoComponent implements OnInit {

  buscar = '';
  fechaFiltro = '';
  listaItems: Array<any> = [];
  listaHeader: Array<any> = [];
  cantidadRegistros: number = 0;
  cantidadPaginas: number[] = [];
  paginaActual: number = 0;
  cantidadEventos: number = 0;

  constructor(
    private eventoService: EventoService,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location   // <-- NUEVO: para actualizar URL sin re-render
  ) { }

  ngOnInit(): void {
    const params = this.route.snapshot.queryParams;
    this.paginaActual = params['page'] ? Number(params['page']) : 0;
    this.fechaFiltro  = params['fecha'] ?? '';
    this.inicializarListaItems();
  }

  async inicializarListaItems(): Promise<void> {
    if (this.fechaFiltro !== '') {
      this.listaItems      = await this.eventoService.getAllEventosByFecha(this.fechaFiltro);
      this.cantidadEventos = this.listaItems.length;

    } else if (this.buscar === '') {
      this.listaItems      = await this.eventoService.getAllEventoByEmpresaId(this.paginaActual);
      this.cantidadEventos = await this.eventoService.cantEventos();

    } else {
      this.listaItems      = await this.eventoService.getAllEventoByFilterName(this.paginaActual, this.buscar);
      this.cantidadEventos = await this.eventoService.cantEventosFiltrados(this.buscar);
    }

    this.cantidadRegistros = this.cantidadEventos;
    this.cantidadPaginas   = new Array<number>(Math.ceil(this.cantidadRegistros / 10));
  }

  updatePaginaActual(pagina: number): void {
    this.paginaActual = pagina;
    this.sincronizarURL();
    this.inicializarListaItems();
  }

  updatePalabraBuscar(palabraBuscar: string): void {
    this.buscar       = palabraBuscar;
    this.paginaActual = 0;
    this.sincronizarURL();
    this.inicializarListaItems();
  }

  // Actualiza la barra del navegador sin triggear el router (sin re-render)
  private sincronizarURL(): void {
    const url = this.router.createUrlTree([], {
      relativeTo: this.route,
      queryParams: { page: this.paginaActual, fecha: this.fechaFiltro || null },
      queryParamsHandling: 'merge',
    }).toString();
    this.location.replaceState(url);
  }

  pagos(id: number): void    { this.router.navigate(['/editEventoPagos',   id]); }
  extras(id: number): void   { this.router.navigate(['/editEventoExtras',   id]); }
  catering(id: number): void { this.router.navigate(['/editEventoCatering', id]); }
  hora(id: number): void     { this.router.navigate(['/editEventoHora',     id]); }
  ver(id: number): void      { this.router.navigate(['/verEvento',          id]); }

  async eliminar(id: number): Promise<void> {
    try {
      await this.eventoService.delete(id);
      await this.inicializarListaItems();
    } catch (error) {
      console.error('Error al eliminar el evento:', error);
    }
  }
}