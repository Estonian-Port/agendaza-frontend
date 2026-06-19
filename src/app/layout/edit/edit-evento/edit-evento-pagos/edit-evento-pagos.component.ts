import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import * as _ from 'lodash';
import { EventoPago } from 'src/app/model/Evento';
import { Pago } from 'src/app/model/Pago';
import { PagoService } from 'src/app/services/pago.service';
import { ErrorMensaje, mostrarErrorConMensaje } from 'src/util/errorHandler';

@Component({
  selector: 'app-edit-evento-pagos',
  templateUrl: './edit-evento-pagos.component.html',
})
export class EditEventoPagosComponent implements OnInit {

  eventoPago : EventoPago = new EventoPago(0,"","",0)
  listaPago : Array<Pago> = []
  
  abonado : number = 0
  faltante : number = 0

  modal = false
  idEliminar = 0
  cuerpoModal = ""
  tituloModal = ""
  botonModal = ""

  envioEmail = false
  errorEnvioEmail = new ErrorMensaje(false, '')
  errors = []

  constructor(
    private router : Router,
    private pagoService : PagoService,
    private route: ActivatedRoute,
    private location: Location
  ) { }

  async ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    this.eventoPago = await this.pagoService.getEventoForEditEventoPago(id)
    this.listaPago = await this.pagoService.getAllPagoFromEvento(id)

    this.abonado = _.sum(this.listaPago.map(it => it.monto))
    this.faltante = this.eventoPago.precioTotal - this.abonado
  }

  agregarPago(){
    this.router.navigate(['/savePago'], { queryParams: { eventoCodigo: this.eventoPago.codigo, eventoId: this.eventoPago.id } });
  }

  editarPago(pagoId: number) {
    this.router.navigate(['/savePago'], { queryParams: { pagoId: pagoId } });
  }

  volver(){
    this.location.back();
  }

  async eliminar(){
    try {
      await this.pagoService.delete(this.idEliminar);
      this.listaPago = await this.pagoService.getAllPagoFromEvento(this.eventoPago.id);
    } catch (error) {
      console.error("Error al eliminar el pago", error);
    }
  }

  modalParaEliminar(id : number, nombre : string){
    this.idEliminar = id
    this.tituloModal = "Eliminar Pago"
    this.cuerpoModal = "Quiere eliminar el pago del evento: " + nombre
    this.botonModal = "Eliminar"
    this.setModal(!this.modal)
  }

  setModal(modal : boolean){
    this.modal = modal
  }

  async enviarEmailPago(pagoId : number){
    try{
      this.envioEmail = await this.pagoService.enviarEmailPago(pagoId, this.eventoPago.id)
      
      setTimeout(() => {
        this.envioEmail = false;
      }, 3000);

    }catch(error: any){
      this.mostrarError(error)
    }
  }

  async descargarPago(id: number) {
    try{
      const blob = await this.pagoService.descargarPago(id)
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = 'comprobante_de_pago.pdf';
      link.click();
      link.remove();
    } catch (error: any) {
      console.error('Error al descargar el PDF:', error);
    }
  }

  async enviarEmailEstadoCuenta(){
    try{

      this.envioEmail = await this.pagoService.enviarEmailEstadoCuenta(this.eventoPago.id)
      
      setTimeout(() => {
        this.envioEmail = false;
      }, 3000);

    }catch(error: any){
       this.mostrarError(error)
    }
  }

  async descargarEstadoCuenta() {
    try{
      const blob = await this.pagoService.descargarEstadoCuenta(this.eventoPago.id)
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = 'comprobante_estado_cuenta.pdf';
      link.click();
      link.remove();
    } catch (error: any) {
      console.error('Error al descargar el PDF:', error);
    }
  }

  mostrarError(error : any){
      this.errorEnvioEmail.condicional = true
      this.envioEmail = false
      
      mostrarErrorConMensaje(this, error)
  
      this.errors.forEach(error => { this.errorEnvioEmail.mensaje = error })
  
      setTimeout(() => {
        this.errorEnvioEmail.condicional = false;
      }, 3000);
  }
}