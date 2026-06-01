import { Component, EventEmitter, Input, OnChanges, SimpleChanges, Output } from '@angular/core';

@Component({
  selector: 'app-abm-data-table-paginacion',
  templateUrl: './abm-data-table-paginacion.component.html',
  styleUrls: ['./abm-data-table-paginacion.component.css']
})
export class AbmDataTablePaginacionComponent implements OnChanges {

  @Input() paginaActual!: number;
  @Input() cantidadPaginas: number[] = [];
  @Input() cantidadRegistros!: number;
  @Input() cantidadEventos!: number;

  @Output() outputPaginaActual = new EventEmitter<number>();

  paginasIntermedias: number[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['paginaActual'] || changes['cantidadPaginas']) {
      this.actualizarPaginasIntermedias();
    }
  }

  get totalPaginas(): number {
    return Math.ceil(this.cantidadRegistros / 10);
  }

  siguiente(): void {
    if (this.paginaActual < this.totalPaginas - 1) {
      this.emitPagina(this.paginaActual + 1);
    }
  }

  atras(): void {
    if (this.paginaActual > 0) {
      this.emitPagina(this.paginaActual - 1);
    }
  }

  irPagina(pagina: number): void {
    this.emitPagina(pagina);
  }

  private emitPagina(pagina: number): void {
    this.outputPaginaActual.emit(pagina);
  }

  getPaginaMitadSuperior(): number {
    return Math.round((this.cantidadPaginas.length - this.paginaActual) * 0.5) + this.paginaActual;
  }

  getPaginaMitadInferior(): number {
    return Math.round(0.5 * this.paginaActual);
  }

  getLimites(paginaActual: number): [number, number] {
    const fin    = Math.max(5, paginaActual);
    const inicio = Math.max(0, fin - 5) + 1;
    return [inicio, fin];
  }

  actualizarPaginasIntermedias(): void {
    const total = this.cantidadPaginas.length;

    if (this.paginaActual < 5) {
      this.paginasIntermedias = [1, 2, 3, 4];
    } else if (this.paginaActual < total - 5) {
      this.paginasIntermedias = [
        this.paginaActual - 1,
        this.paginaActual,
        this.paginaActual + 1,
      ];
    } else {
      this.paginasIntermedias = [
        total - 5,
        total - 4,
        total - 3,
        total - 2,
      ];
    }
  }

  trackByFn(_index: number, item: number): number {
    return item;
  }
}