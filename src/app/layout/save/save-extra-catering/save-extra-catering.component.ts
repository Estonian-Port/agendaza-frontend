import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as _ from 'lodash';
import { fadeOut } from 'src/app/animations/fade-out';
import { Extra } from 'src/app/model/Extra';
import { GenericItemEmpresaTipoEvento } from 'src/app/model/GenericItem';
import { ExtraService } from 'src/app/services/extra.service';

@Component({
  selector: 'app-save-extra-catering',
  templateUrl: './save-extra-catering.component.html',
  animations: [fadeOut]
})
export class SaveExtraCateringComponent implements OnInit {

  extra = new Extra(0, "", "TIPO_CATERING", 0,[],0)
  listaExtra : Array<GenericItemEmpresaTipoEvento> = []
  listaTipoExtra : Array<string> = []
  busquedaExtra = ''
  errorBusqueda = false

  private timeoutBusqueda?: ReturnType<typeof setTimeout>
  private busquedaId = 0

  otro = false
  edicion = false

  constructor(
    private extraService : ExtraService,
    private route: ActivatedRoute,
    private location : Location) { }

  async ngOnInit(): Promise<void> {
    this.listaTipoExtra = await this.extraService.getAllCateringTipoExtra()

    await this.route.queryParams.subscribe(async params => {
      
      if (params['extraId']) {
        const extraId = Number(params['extraId']);
        this.extra = await this.extraService.getExtra(extraId)
        this.otro = true
        this.edicion = true
      }
    })
  }

  onBusquedaChange(q: string): void {
    this.busquedaExtra = q
    this.extra = new Extra(0, "", "TIPO_CATERING", 0, [], 0)
    this.otro = false
    this.listaExtra = []
    this.errorBusqueda = false

    if (this.timeoutBusqueda) clearTimeout(this.timeoutBusqueda)
    const busquedaId = ++this.busquedaId
    const query = q.trim()
    if (!query) return

    this.timeoutBusqueda = setTimeout(async () => {
      try {
        const resultados = await this.extraService.buscarExtraCatering(query)
        if (busquedaId === this.busquedaId) {
          this.listaExtra = resultados
          if (resultados.length === 0) {
            this.extra.nombre = query
            this.otro = true
          }
        }
      } catch {
        if (busquedaId === this.busquedaId) this.errorBusqueda = true
      }
    }, 250)
  }

  async seleccionarExtra(extra: GenericItemEmpresaTipoEvento): Promise<void> {
    this.cancelarBusquedaPendiente()
    const seleccionId = this.busquedaId

    try {
      const extraCompleto = await this.extraService.getExtra(extra.id)
      if (seleccionId !== this.busquedaId) return

      this.extra = extraCompleto
      this.busquedaExtra = extraCompleto.nombre
      this.listaExtra = []
      this.otro = false
      this.errorBusqueda = false
    } catch {
      if (seleccionId === this.busquedaId) this.errorBusqueda = true
    }
  }

  async save(){
    const item = await this.extraService.save(this.extra)
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