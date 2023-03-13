import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as _ from 'lodash';
import { EventoPago } from 'src/app/model/Evento';
import { Pago } from 'src/app/model/Pago';
import { EventoService } from 'src/app/services/evento.service';

@Component({
  selector: 'app-edit-evento-pagos',
  templateUrl: './edit-evento-pagos.component.html',
  styleUrls: ['./edit-evento-pagos.component.css']
})
export class EditEventoPagosComponent implements OnInit {

  eventoPago : EventoPago = new EventoPago(0,"","",0,[])
  abonado : number = 0
  faltante : number = 0

  constructor(private eventoService : EventoService, private router : Router) { }

  async ngOnInit() {
    this.eventoPago = await this.eventoService.getEventoPago()
  
    this.abonado = _.sum(this.eventoPago.listaPagos.map(it => it.monto))
    this.faltante = this.eventoPago.precioTotal - this.abonado

  }

  savePago(){
    this.router.navigateByUrl("/savePago")
  }

  volver(){
    this.router.navigateByUrl("/abmEvento")
  }

}