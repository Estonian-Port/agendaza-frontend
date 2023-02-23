import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash';
import { ExtraService } from 'src/app/services/extra.service';

@Component({
  selector: 'app-extra-abm-catering',
  templateUrl: './abm-extra-catering.component.html',
  styleUrls: ['./abm-extra-catering.component.css']
})
export class AbmExtraCateringComponent implements OnInit {
  buscar = ''
  listaItems : Array<any> = []
  cantidadRegistros : number[] = []
  cantidadPaginas : number[] = []
  currentRegistro : number = 0

  constructor(private extraService : ExtraService) { }

  async ngOnInit(): Promise<void> {
    this.listaItems = await this.extraService.getAllExtraCateringByEmpresaId()
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