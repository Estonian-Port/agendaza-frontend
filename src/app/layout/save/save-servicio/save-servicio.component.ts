import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { fadeOut } from 'src/app/animations/fade-out';
import { GenericItem, GenericItemEmpresaTipoEvento } from 'src/app/model/GenericItem';
import { ServicioService } from 'src/app/services/servicio.service';

@Component({
  selector: 'app-save-servicio',
  templateUrl: './save-servicio.component.html',
  animations: [fadeOut]
})
export class SaveServicioComponent implements OnInit {
  
  genericItem : GenericItemEmpresaTipoEvento = new GenericItemEmpresaTipoEvento(0, "", 0, [])
  listaServicio : Array<GenericItem> = []
  busquedaServicio = ''
  errorBusqueda = false

  private timeoutBusqueda?: ReturnType<typeof setTimeout>
  private busquedaId = 0

  otro = false
  edicion = false
  
  constructor(
    private servicioService : ServicioService,
    private route: ActivatedRoute,
    private location : Location) { }

  async ngOnInit(): Promise<void> {

    await this.route.queryParams.subscribe(async params => {
      
      if (params['servicioId']) {
        const servicioId = Number(params['servicioId']);
        this.genericItem = await this.servicioService.getServicio(servicioId)
        this.otro = true
        this.edicion = true
      }
    })
  }

  onBusquedaChange(q: string): void {
    this.busquedaServicio = q
    this.genericItem = new GenericItemEmpresaTipoEvento(0, "", 0, [])
    this.otro = false
    this.listaServicio = []
    this.errorBusqueda = false

    if (this.timeoutBusqueda) clearTimeout(this.timeoutBusqueda)
    const busquedaId = ++this.busquedaId
    const query = q.trim()
    if (!query) return

    this.timeoutBusqueda = setTimeout(async () => {
      try {
        const resultados = await this.servicioService.buscarServicio(query)
        if (busquedaId === this.busquedaId) {
          this.listaServicio = resultados
          if (resultados.length === 0) {
            this.genericItem.nombre = query
            this.otro = true
          }
        }
      } catch {
        if (busquedaId === this.busquedaId) this.errorBusqueda = true
      }
    }, 250)
  }

  async seleccionarServicio(servicio: GenericItem): Promise<void> {
    this.cancelarBusquedaPendiente()
    const seleccionId = this.busquedaId

    try {
      const servicioCompleto = await this.servicioService.getServicio(servicio.id)
      if (seleccionId !== this.busquedaId) return

      this.genericItem = servicioCompleto
      this.busquedaServicio = servicioCompleto.nombre
      this.listaServicio = []
      this.otro = false
      this.errorBusqueda = false
    } catch {
      if (seleccionId === this.busquedaId) this.errorBusqueda = true
    }
  }


  async save(){
    await this.servicioService.save(this.genericItem)
    this.volver()
  }

  volver(){
    this.location.back()
  }

  private cancelarBusquedaPendiente(): void {
    if (this.timeoutBusqueda) clearTimeout(this.timeoutBusqueda)
    this.busquedaId++
  }
  
}

