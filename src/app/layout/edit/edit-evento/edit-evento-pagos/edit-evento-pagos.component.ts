import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as _ from 'lodash';
import { EventoPago } from 'src/app/model/Evento';
import { EventoService } from 'src/app/services/evento.service';
import { PagoService } from 'src/app/services/pago.service';

@Component({
  selector: 'app-edit-evento-pagos',
  templateUrl: './edit-evento-pagos.component.html',
})
export class EditEventoPagosComponent implements OnInit {

  eventoPago : EventoPago = new EventoPago(0,"","",0,[])
  abonado : number = 0
  faltante : number = 0

  constructor(private eventoService : EventoService, private router : Router, private pagoService : PagoService) { }

  async ngOnInit() {
    this.eventoPago = await this.eventoService.getEventoPago()
  
    this.abonado = _.sum(this.eventoPago.listaPagos.map(it => it.monto))
    this.faltante = this.eventoPago.precioTotal - this.abonado

  }

  agregarPago(){
    this.eventoService.eventoCodigo = this.eventoPago.codigo
    this.router.navigateByUrl("/savePago")
  }

  volver(){
    this.router.navigateByUrl("/abmEvento")
  }

  async descargar(id: number) {
    const blob = await this.pagoService.generarComprobanteDePago(id)
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = 'comprobante_de_pago.pdf';
    link.click();
    link.remove();
  } catch (error: any) {
    console.error('Error al descargar el PDF:', error);
  }

}
