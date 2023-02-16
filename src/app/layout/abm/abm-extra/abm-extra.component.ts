import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash';
import { ExtraService } from 'src/app/services/extra.service';

@Component({
  selector: 'app-abm-extra',
  templateUrl: './abm-extra.component.html',
  styleUrls: ['./abm-extra.component.css']
})
export class AbmExtraComponent implements OnInit {

  buscar = ''
  listaItems : Array<any> = []
  cantidadRegistros : number[] = []
  cantidadPaginas : number[] = []
  currentRegistro : number = 0

  constructor(private extraService : ExtraService) { }

  async ngOnInit(): Promise<void> {
    this.listaItems = await this.extraService.getAllExtraByEmpresaId()
    this.listaItems = _.sortBy(this.listaItems, ["id","weight"]);

    this.cantidadRegistros = new Array<number>(this.listaItems.length)
    this.cantidadPaginas = new Array<number>(Math.trunc(this.listaItems.length / 11) + 1)

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
