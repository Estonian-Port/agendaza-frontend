import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import * as _ from 'lodash';
import { EventoPago } from 'src/app/model/Evento';
import { Pago } from 'src/app/model/Pago';
import { Gasto } from 'src/app/model/Gasto';
import { PagoService } from 'src/app/services/pago.service';
import { GastoService } from 'src/app/services/gasto.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-edit-evento-pagos',
  templateUrl: './edit-evento-pagos.component.html',
})
export class EditEventoPagosComponent implements OnInit {

  eventoPago : EventoPago = new EventoPago(0,"","",0)
  listaPago : Array<Pago> = []
  listaGasto : Array<Gasto> = []
  cargandoPagos = true
  cargandoGastos = true
  
  abonado : number = 0
  faltante : number = 0

  modal = false
  idEliminar = 0
  tipoEliminar: 'pago' | 'gasto' = 'pago'
  cuerpoModal = ""
  tituloModal = ""
  botonModal = ""
  descargaEstadoCuentaEnCurso = false
  emailEstadoCuentaEnCurso = false
  emailsPagoEnCurso = new Set<number>()
  descargasPagoEnCurso = new Set<number>()

  constructor(
    private router : Router,
    private pagoService : PagoService,
    private gastoService: GastoService,
    private route: ActivatedRoute,
    private location: Location,
    private toastService: ToastService
  ) { }

  async ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    this.eventoPago = await this.pagoService.getEventoForEditEventoPago(id);
    const [pagos, gastos] = await Promise.all([
      this.pagoService.getAllPagoFromEvento(id),
      this.gastoService.getAllGastoFromEvento(id)
    ]);
    this.listaPago = pagos;
    this.listaGasto = gastos;
    this.cargandoPagos = false
    this.cargandoGastos = false

    this.abonado = _.sum(this.listaPago.map(it => it.monto))
    this.faltante = this.eventoPago.precioTotal - this.abonado
  }

  get totalGastos(): number {
    return _.sum(this.listaGasto.map(gasto => gasto.monto))
  }

  agregarPago(){
    this.router.navigate(['/savePago'], { queryParams: { eventoCodigo: this.eventoPago.codigo, eventoId: this.eventoPago.id } });
  }

  agregarGasto() {
    this.router.navigate(['/saveGasto'], { queryParams: { eventoCodigo: this.eventoPago.codigo, eventoId: this.eventoPago.id } });
  }

  editarPago(pagoId: number) {
    this.router.navigate(['/savePago'], { queryParams: { pagoId: pagoId } });
  }

  editarGasto(gastoId: number) {
    this.router.navigate(['/saveGasto'], { queryParams: { gastoId } });
  }

  volver(){
    this.location.back();
  }

  async eliminar(){
    try {
      if (this.tipoEliminar === 'gasto') {
        await this.gastoService.delete(this.idEliminar);
        this.listaGasto = await this.gastoService.getAllGastoFromEvento(this.eventoPago.id);
      } else {
        await this.pagoService.delete(this.idEliminar);
        this.listaPago = await this.pagoService.getAllPagoFromEvento(this.eventoPago.id);
      }
    } catch (error) {
      console.error(`Error al eliminar el ${this.tipoEliminar}`, error);
    }
  }

  modalParaEliminar(id: number, nombre: string, tipo: 'pago' | 'gasto' = 'pago') {
    this.idEliminar = id
    this.tipoEliminar = tipo
    const etiqueta = tipo === 'pago' ? 'pago' : 'gasto'
    this.tituloModal = `Eliminar ${etiqueta.charAt(0).toUpperCase()}${etiqueta.slice(1)}`
    this.cuerpoModal = `Quiere eliminar el ${etiqueta} del evento: ${nombre}`
    this.botonModal = "Eliminar"
    this.setModal(!this.modal)
  }

  setModal(modal : boolean){
    this.modal = modal
  }

  async enviarEmailPago(pagoId : number): Promise<void> {
    if (this.emailsPagoEnCurso.has(pagoId)) return;
    this.emailsPagoEnCurso.add(pagoId);
    try {
      const enviado = await this.pagoService.enviarEmailPago(pagoId, this.eventoPago.id);

      if (enviado) {
        this.toastService.showSuccess('Mail enviado correctamente al cliente');
      } else {
        this.toastService.showError('No se pudo enviar el mail al cliente');
      }
    } catch (error: unknown) {
      this.toastService.showError('Ocurrió un error al enviar el mail');
    } finally {
      this.emailsPagoEnCurso.delete(pagoId);
    }
  }

  async descargarPago(id: number): Promise<void> {
    if (this.descargasPagoEnCurso.has(id)) return;
    this.descargasPagoEnCurso.add(id);
    try {
      const blob = await this.pagoService.descargarPago(id);
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = 'comprobante_de_pago.pdf';
      link.click();
      link.remove();
      this.toastService.showSuccess('Comprobante de pago descargado correctamente');
    } catch (error: unknown) {
      this.toastService.showError('Ocurrió un error al descargar el comprobante de pago');
    } finally {
      this.descargasPagoEnCurso.delete(id);
    }
  }

  async enviarEmailEstadoCuenta(): Promise<void> {
    if (this.emailEstadoCuentaEnCurso) return;
    this.emailEstadoCuentaEnCurso = true;
    try {
      const enviado = await this.pagoService.enviarEmailEstadoCuenta(this.eventoPago.id);

      if (enviado) {
        this.toastService.showSuccess('Estado de cuenta enviado correctamente al cliente');
      } else {
        this.toastService.showError('No se pudo enviar el estado de cuenta');
      }
    } catch (error: unknown) {
      this.toastService.showError('Ocurrió un error al enviar el estado de cuenta');
    } finally {
      this.emailEstadoCuentaEnCurso = false;
    }
  }

  async descargarEstadoCuenta(): Promise<void> {
    if (this.descargaEstadoCuentaEnCurso) return;
    this.descargaEstadoCuentaEnCurso = true;
    try {
      const blob = await this.pagoService.descargarEstadoCuenta(this.eventoPago.id);
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = 'comprobante_estado_cuenta.pdf';
      link.click();
      link.remove();
      this.toastService.showSuccess('Estado de cuenta descargado correctamente');
    } catch (error: unknown) {
      this.toastService.showError('Ocurrió un error al descargar el estado de cuenta');
    } finally {
      this.descargaEstadoCuentaEnCurso = false;
    }
  }
}