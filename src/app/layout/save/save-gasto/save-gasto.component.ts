import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Gasto } from 'src/app/model/Gasto';
import { GastoService } from 'src/app/services/gasto.service';
import { PagoService } from 'src/app/services/pago.service';
import { ErrorMensaje, mostrarErrorConMensaje } from 'src/util/errorHandler';

@Component({
  selector: 'app-save-gasto',
  templateUrl: './save-gasto.component.html',
})
export class SaveGastoComponent implements OnInit {

  gasto: Gasto = Gasto.vacio()

  listaTipoGasto: Array<string> = []
  listaMedioDePago: Array<string> = []

  guardando = false

  constructor(
    private gastoService: GastoService,
    private pagoService: PagoService,
    private route: ActivatedRoute,
    private location: Location
  ) { }

  async ngOnInit(): Promise<void> {
    this.listaTipoGasto = await this.gastoService.getAllTipoGasto()
    this.listaMedioDePago = await this.pagoService.getAllMedioDePago()

    this.route.queryParams.subscribe(async params => {
      // Editar: ?gastoId=X
      if (params['gastoId']) {
        this.gasto = await this.gastoService.get(Number(params['gastoId']))
        this.gasto.fecha = this.gasto.fecha.slice(0, 16)
      }
      // Gasto desde un evento: ?eventoCodigo=Z (opcional, por si después lo enlazás desde edit-evento)
      if (params['eventoCodigo']) {
        this.gasto.codigoEvento = params['eventoCodigo']
        this.gasto.tipoGasto = 'EVENTO'
      }
    })
  }

  get requiereEvento(): boolean {
    return this.gasto.tipoGasto === 'EVENTO'
  }

  get formularioValido(): boolean {
    return this.gasto.monto > 0
      && this.gasto.descripcion.trim().length > 0
      && (!this.requiereEvento || !!this.gasto.codigoEvento?.trim())
  }

  async save() {
    if (!this.formularioValido || this.guardando) return
    this.guardando = true
    try {
      await this.gastoService.save(this.gasto)
      this.volver()
    } catch (error) {
      mostrarErrorConMensaje(this, error)
    } finally {
      this.guardando = false
    }
  }

  volver() {
    this.location.back()
  }
}