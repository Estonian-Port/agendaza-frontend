import { Component, OnInit } from '@angular/core';
import { Pago } from 'src/app/model/Pago';
import { EmpresaService } from 'src/app/services/empresa.service';
import { PagoService } from 'src/app/services/pago.service';
import { ErrorMensaje, mostrarErrorConMensaje } from 'src/util/errorHandler';

@Component({
  selector: 'app-save-pago',
  templateUrl: './save-pago.component.html',
  styleUrls: ['./save-pago.component.css']
})
export class SavePagoComponent implements OnInit {

  pago = new Pago(0, 0, "", "", "TRANSFERENCIA", new Date(0,0,0,0,0,0))
  codigo : string = ""
  listaMedioDePago : Array<string> = []
  errors = []
  errorUsuario : ErrorMensaje = new ErrorMensaje(false, '')

  constructor(private pagoService : PagoService, private empresaService : EmpresaService) { }

  async ngOnInit(): Promise<void> {
    this.listaMedioDePago = await this.pagoService.getAllMedioDePago()
  }

  async buscar(){
    try {
      this.pago = await this.pagoService.getEventoForPago(this.codigo)
      this.errorUsuario.condicional = false
    } catch (error) {
      this.pago = new Pago(0, 0, "", "", "TRANSFERENCIA", new Date(0,0,0,0,0,0))
      this.errorUsuario.condicional = true
      console.log(error)
      mostrarErrorConMensaje(this, error)
      this.errors.forEach(error => { this.errorUsuario.mensaje = error })
    }
  }
}
