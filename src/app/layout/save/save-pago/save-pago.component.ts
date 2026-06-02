import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Pago } from 'src/app/model/Pago';
import { PagoService } from 'src/app/services/pago.service';
import { ErrorMensaje, mostrarErrorConMensaje } from 'src/util/errorHandler';

@Component({
  selector: 'app-save-pago',
  templateUrl: './save-pago.component.html',
})
export class SavePagoComponent implements OnInit {

  pago : Pago = new Pago(0, 0, "", "", "", new Date(0,0,0,0,0,0),new Date(0,0,0,0,0,0),0,0, "","")
  codigo : string = ""
  eventoId : number = 0
  
  listaMedioDePago : Array<string> = []
  listaConcepto : Array<string> = []
  
  errors = []
  error : ErrorMensaje = new ErrorMensaje(false, '')
  botonBuscarDisabled : boolean = false

  constructor(
    private pagoService : PagoService, 
    private route: ActivatedRoute,
    private location: Location
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
        this.codigo = this.pago.codigo;
        this.botonBuscarDisabled = true;
      }
      
      // CASO 2: Venimos de agregar un pago a un evento específico (?eventoId=Y&eventoCodigo=Z)
      if (params['eventoId']) {
        this.eventoId = Number(params['eventoId']);
        
        if (params['eventoCodigo']) {
          this.codigo = params['eventoCodigo'];
        }
        
        await this.buscar();
        this.botonBuscarDisabled = true;
      }
    });
  }

  async buscar(){
    try {
      this.pago = await this.pagoService.getEventoForSavePago(this.eventoId)
      
      this.pago.medioDePago = "TRANSFERENCIA"
      this.pago.concepto = "SENIA"
      this.error.condicional = false
    } catch (error) {
      this.error.condicional = true
      mostrarErrorConMensaje(this, error)
      this.errors.forEach(error => { this.error.mensaje = error })
    }
  }

  async save(){
    await this.pagoService.save(this.pago)
    this.volver()
  }

  volver(){
    this.location.back(); 
  }

  cleanCouta() {
    this.pago.numeroCuota = undefined
  }
}