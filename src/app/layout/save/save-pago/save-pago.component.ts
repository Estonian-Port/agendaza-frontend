import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Pago } from 'src/app/model/Pago';
import { PagoService } from 'src/app/services/pago.service';
import { mostrarErrorConMensaje } from 'src/util/errorHandler';
import { EventoService } from 'src/app/services/evento.service';
import { Evento } from 'src/app/model/Evento';

@Component({
  selector: 'app-save-pago',
  templateUrl: './save-pago.component.html',
})
export class SavePagoComponent implements OnInit {

  pago : Pago = new Pago(0, 0, "", "", "", new Date(0,0,0,0,0,0),new Date(0,0,0,0,0,0),0,0, "","")
  codigo : string = ""
  eventoId : number = 0
  fechaBusqueda = new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 10)
  fechaPago = ''
  modoBusqueda: 'fecha' | 'codigo' = 'fecha'
  eventos: Evento[] = []
  buscando = false
  mostrarBusquedaEvento = true
  
  listaMedioDePago : Array<string> = []
  listaConcepto : Array<string> = []

  botonBuscarDisabled : boolean = false

  constructor(
    private pagoService : PagoService, 
    private route: ActivatedRoute,
    private location: Location,
    private eventoService: EventoService
  ) { }

  async ngOnInit(): Promise<void> {
    this.listaMedioDePago = await this.pagoService.getAllMedioDePago()
    this.listaConcepto = await this.pagoService.getAllConcepto()

    // Leemos los parámetros de la URL
    await this.route.queryParams.subscribe(async params => {
      
      // CASO 1: Estamos editando un pago existente (?pagoId=X)
      if (params['pagoId']) {
        const pagoId = Number(params['pagoId']);
        this.pago = await this.pagoService.get(pagoId);
        this.fechaPago = this.formatearFechaLocal(this.pago.fecha);
        this.seleccionarOpcionesPorDefecto();
        this.codigo = this.pago.codigo;
        this.mostrarBusquedaEvento = false;
        this.botonBuscarDisabled = true;
      }
      
      // CASO 2: Venimos de agregar un pago a un evento específico (?eventoId=Y&eventoCodigo=Z)
      if (params['eventoId']) {
        this.eventoId = Number(params['eventoId']);
        
        if (params['eventoCodigo']) {
          this.codigo = params['eventoCodigo'];
        }
        
        await this.cargarPagoDelEvento(this.eventoId);
        this.botonBuscarDisabled = true;
      }
    });
  }

  async buscar(){
    this.buscando = true;
    this.eventos = [];
    try {
      if (this.modoBusqueda === 'fecha') {
        this.eventos = await this.eventoService.getAllEventosByFecha(this.fechaBusqueda);
        if (this.eventos.length === 0) {
          mostrarErrorConMensaje(this, new Error('No hay eventos para esa fecha.'));
        }
      } else {
        if (!this.codigo.trim()) throw new Error('Ingresá el código del evento.');
        this.eventoId = await this.eventoService.getEventoIdByCodigo(this.codigo.trim());
        await this.cargarPagoDelEvento(this.eventoId);
      }
    } catch (error) {
      mostrarErrorConMensaje(this, error);
    } finally {
      this.buscando = false;
    }
  }

  async seleccionarEvento(evento: Evento) {
    this.eventos = [];
    this.codigo = evento.codigo;
    this.eventoId = evento.id;
    await this.cargarPagoDelEvento(evento.id);
    this.mostrarBusquedaEvento = false;
  }

  private async cargarPagoDelEvento(eventoId: number) {
    try {
      this.pago = await this.pagoService.getEventoForSavePago(eventoId);
      this.fechaPago = this.formatearFechaLocal(this.pago.fecha);
      this.seleccionarOpcionesPorDefecto();
    } catch (error) {
      mostrarErrorConMensaje(this, error);
    }
  }

  private seleccionarOpcionesPorDefecto(){
    if (!this.pago.medioDePago && this.listaMedioDePago.length > 0) {
      this.pago.medioDePago = this.listaMedioDePago[0];
    }
    if (!this.pago.concepto && this.listaConcepto.length > 0) {
      this.pago.concepto = this.listaConcepto[0];
    }
  }

  async save(){
    await this.pagoService.save({ ...this.pago, fecha: this.fechaPago })
    this.volver()
  }

  cambiarEvento() {
    this.mostrarBusquedaEvento = true;
    this.eventos = [];
  }

  private formatearFechaLocal(fecha: Date | string): string {
    const date = new Date(fecha);
    if (Number.isNaN(date.getTime())) return String(fecha).slice(0, 16);
    const pad = (value: number) => String(value).padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
  }

  volver(){
    this.location.back(); 
  }

  cleanCouta() {
    this.pago.numeroCuota = undefined
  }
}