import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-abm-data-table-header',
  templateUrl: './abm-data-table-header.component.html',
  styleUrls: ['./abm-data-table-header.component.css']
})
export class AbmDataTableHeaderComponent implements OnInit {

  buscar : string = ''

  @Input()
  realizoBusqueda! : Boolean

  @Input()
  paginaActual : number = 0

  @Input()
  titulo : string = ''

  @Output() 
  outputBuscar = new EventEmitter<string>();

  @Output() 
  outputBusqueda = new EventEmitter<Boolean>();

  @Output() 
  outputPaginaActual = new EventEmitter<number>();

  constructor(private router : Router) { }

  ngOnInit(): void {}

  outputPalabraBuscar() {
    this.outputBuscar.emit(this.buscar);
  }

  actualizaBuscar(){
    this.realizoBusqueda = true
    this.outputBusqueda.emit(this.realizoBusqueda);
    this.outputPalabraBuscar()
    this.outputRegistro()
  }

  outputRegistro() {
    this.outputPaginaActual.emit(this.paginaActual);    
  }

  private routeMap: { [key: string]: string } = {
    'Eventos': '/saveEvento',
    'Extras': '/saveExtraEvento',
    'Pagos': '/savePago',
    'Empleados': '/saveUsuario',
    'Tipo Eventos': '/saveTipoEvento',
    'Servicios': '/saveServicio',
    'Catering': '/saveExtraCatering',
    'Clientes': '/saveCliente'
  };

  getRoute(): string {
    return this.routeMap[this.titulo] || '';
  }

  volver() {
    this.router.navigateByUrl('/panelAdmin')
  }

  
}
