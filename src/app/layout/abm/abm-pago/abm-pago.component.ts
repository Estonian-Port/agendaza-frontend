import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash';
import { PagoService } from 'src/app/services/pago.service';

@Component({
  selector: 'app-abm-pago',
  templateUrl: './abm-pago.component.html',
  styleUrls: ['./abm-pago.component.css']
})
export class AbmPagoComponent implements OnInit {


  buscar = ''
  listaItems : Array<any> = []
  listaHeader : Array<any> =[]
  cantidadRegistros : number[] = []
  cantidadPaginas : number[] = []
  currentRegistro : number = 0

  constructor(private pagoService : PagoService) { }

  async ngOnInit(): Promise<void> {
    this.listaItems = await this.pagoService.getAllPagoByEmpresaId()
    this.listaItems = _.sortBy(this.listaItems, ["id","weight"]);

    this.cantidadRegistros = new Array<number>(this.listaItems.length)
    this.cantidadPaginas = new Array<number>(Math.trunc(this.listaItems.length / 10) + 1)

    this.listaHeader.push("Pago")
    this.listaHeader.push("Codigo")
    this.listaHeader.push("Evento")
    this.listaHeader.push("Fecha de pago")

  }

  updateCurrentRegistro(registro: number){
    this.currentRegistro = registro
  }

  updatePalabraBuscar(palabraBuscar: string){
    this.buscar = palabraBuscar
  }

  updateCantidadPaginas(cantidadPaginas: number[]){
    this.cantidadPaginas = cantidadPaginas
  }



}
