import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash';
import { TipoEventoService } from 'src/app/services/tipo-evento.service';

@Component({
  selector: 'app-abm-tipo-evento',
  templateUrl: './abm-tipo-evento.component.html',
  styleUrls: ['./abm-tipo-evento.component.css']
})
export class AbmTipoEventoComponent implements OnInit {

  buscar = ''
  listaItems : Array<any> = []
  listaHeader : Array<any> =[]
  cantidadRegistros : number[] = []
  cantidadPaginas : number[] = []
  currentRegistro : number = 0

  constructor(private tipoEventoService : TipoEventoService) { }

  async ngOnInit(): Promise<void> {
    this.listaItems = await this.tipoEventoService.getAllTipoEventoByEmpresaId()
    this.listaItems = _.sortBy(this.listaItems, ["id","weight"]);

    this.cantidadRegistros = new Array<number>(this.listaItems.length)
    this.cantidadPaginas = new Array<number>(Math.trunc(this.listaItems.length / 11) + 1)

    this.listaHeader.push("Nombre")
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
