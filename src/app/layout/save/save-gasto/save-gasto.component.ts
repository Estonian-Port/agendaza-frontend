import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Gasto } from 'src/app/model/Gasto';
import { GastoService } from 'src/app/services/gasto.service';
import { PagoService } from 'src/app/services/pago.service';
import { Evento } from 'src/app/model/Evento';
import { EventoService } from 'src/app/services/evento.service';
import { mostrarErrorConMensaje } from 'src/util/errorHandler';

type EventoSeleccionado = Pick<Evento, 'id' | 'nombre' | 'codigo' | 'inicio' | 'fin' | 'estado'>;

@Component({
  selector: 'app-save-gasto',
  templateUrl: './save-gasto.component.html',
})
export class SaveGastoComponent implements OnInit {

  gasto: Gasto = Gasto.vacio()

  listaTipoGasto: Array<string> = []
  listaMedioDePago: Array<string> = []

  guardando = false
  fechaBusqueda = Gasto.ahoraLocal().slice(0, 10)
  modoBusqueda: 'fecha' | 'codigo' = 'fecha'
  codigoBusqueda = ''
  eventos: Evento[] = []
  eventoSeleccionado: EventoSeleccionado | null = null
  buscandoEvento = false
  cambiandoEvento = false

  constructor(
    private gastoService: GastoService,
    private pagoService: PagoService,
    private route: ActivatedRoute,
    private location: Location,
    private eventoService: EventoService
  ) { }

  async ngOnInit(): Promise<void> {
    this.listaTipoGasto = await this.gastoService.getAllTipoGasto()
    this.listaMedioDePago = await this.pagoService.getAllMedioDePago()

    this.route.queryParams.subscribe(async params => {
      // Editar: ?gastoId=X
      if (params['gastoId']) {
        this.gasto = await this.gastoService.get(Number(params['gastoId']))
        this.gasto.fecha = this.gasto.fecha.slice(0, 16)
        if (this.gasto.eventoId) {
          const evento = await this.eventoService.getEventoVer(this.gasto.eventoId)
          this.eventoSeleccionado = evento
        }
      }
      // Gasto desde un evento: ?eventoCodigo=Z (opcional, por si después lo enlazás desde edit-evento)
      if (params['eventoCodigo']) {
        this.gasto.codigoEvento = params['eventoCodigo']
        this.gasto.tipoGasto = 'EVENTO'
        this.codigoBusqueda = params['eventoCodigo']
      }
    })
  }

  get requiereEvento(): boolean {
    return this.gasto.tipoGasto === 'EVENTO'
  }

  get formularioValido(): boolean {
    return this.gasto.monto > 0
      && this.gasto.descripcion.trim().length > 0
      && (!this.requiereEvento || !!(this.gasto.eventoId || this.gasto.codigoEvento?.trim()))
  }

  async buscarEvento() {
    this.eventos = []
    this.buscandoEvento = true
    try {
      if (this.modoBusqueda === 'fecha') {
        if (!/^\d{4}-\d{2}-\d{2}$/.test(this.fechaBusqueda)) {
          throw new Error('Ingresá una fecha válida.')
        }
        this.eventos = await this.eventoService.getAllEventosByFecha(this.fechaBusqueda)
      } else {
        if (!this.codigoBusqueda.trim()) throw new Error('Ingresá el código del evento.')
        const eventoId = await this.eventoService.getEventoIdByCodigo(this.codigoBusqueda.trim())
        const evento = await this.eventoService.getEventoVer(eventoId)
        this.seleccionarEvento(evento)
      }
      if (this.modoBusqueda === 'fecha' && this.eventos.length === 0) {
        throw new Error('No hay eventos para esa fecha.')
      }
    } catch (error) {
      mostrarErrorConMensaje(this, error)
    } finally {
      this.buscandoEvento = false
    }
  }

  seleccionarEvento(evento: EventoSeleccionado) {
    this.eventoSeleccionado = evento
    this.gasto.eventoId = evento.id
    this.gasto.codigoEvento = evento.codigo
    this.gasto.nombreEvento = evento.nombre
    this.cambiandoEvento = false
    this.eventos = []
  }

  quitarEvento() {
    this.eventoSeleccionado = null
    this.gasto.eventoId = undefined
    this.gasto.codigoEvento = undefined
    this.gasto.nombreEvento = undefined
    this.codigoBusqueda = ''
    this.eventos = []
    this.cambiandoEvento = true
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