import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Pago } from 'src/app/model/Pago';
import { EventoService } from 'src/app/services/evento.service';
import { PagoService } from 'src/app/services/pago.service';
import { ErrorMensaje, mostrarErrorConMensaje } from 'src/util/errorHandler';

@Component({
  selector: 'app-save-pago',
  templateUrl: './save-pago.component.html',
})
export class SavePagoComponent implements OnInit {

  pago = new Pago(0, 0, "", "", "", new Date(0,0,0,0,0,0),0,0,"", undefined)
  codigo : string = ""
  listaMedioDePago : Array<string> = []
  listaConcepto : Array<string> = []
  
  errors = []
  error : ErrorMensaje = new ErrorMensaje(false, '')
  botonBuscarDisabled : boolean = false

  constructor(private pagoService : PagoService, private eventoService : EventoService, private router : Router) { }

  async ngOnInit(): Promise<void> {
    this.listaMedioDePago = await this.pagoService.getAllMedioDePago()
    this.listaConcepto = await this.pagoService.getAllConcepto()

    if(this.eventoService.eventoCodigo != ""){
      this.codigo = this.eventoService.eventoCodigo
      this.eventoService.eventoCodigo = ""
      this.buscar()
      this.botonBuscarDisabled = true
    }

    if(this.pagoService.pagoId){
      this.pago = await this.pagoService.get(this.pagoService.pagoId)
      this.pagoService.pagoId = 0
      this.botonBuscarDisabled = true
    }
  }

  async buscar(){

    try {
      this.pago = await this.pagoService.getEventoForPago(this.codigo)
      this.pago.medioDePago = "TRANSFERENCIA"
      this.error.condicional = false
    } catch (error) {
      this.pago = new Pago(0, 0, "", "", "", new Date(0,0,0,0,0,0),0,0,"",undefined)
      this.error.condicional = true

      mostrarErrorConMensaje(this, error)
      this.errors.forEach(error => { this.error.mensaje = error })
    }
  }

  async save(){
    const item = await this.pagoService.save(this.pago)
    this.volver()
  }

  volver(){
    if(this.eventoService.eventoId != 0){
      this.router.navigateByUrl('/editEventoPagos')
    }else{
      this.router.navigateByUrl('/abmPago')
    }
  }
}
