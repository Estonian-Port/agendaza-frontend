import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as _ from 'lodash';
import { ServicioService } from 'src/app/services/servicio.service';
import { Location } from '@angular/common';


@Component({
  selector: 'app-abm-servicio',
  templateUrl: './abm-servicio.component.html',
  styleUrls: ['./abm-servicio.component.css']
})
export class AbmServicioComponent implements OnInit {


  buscar = ''
  listaItems : Array<any> = []
  cantidadRegistros : number[] = []
  cantidadPaginas : number[] = []
  currentRegistro : number = 0

  constructor(private servicioService : ServicioService, private router : Router, private location : Location) { }

  async ngOnInit(): Promise<void> {
    this.listaItems = await this.servicioService.getAllServicioByEmpresaId()
    this.listaItems = _.sortBy(this.listaItems, ["id","weight"]);

    this.cantidadRegistros = new Array<number>(this.listaItems.length)
    this.cantidadPaginas = new Array<number>(Math.trunc(this.listaItems.length / 10) + 1)

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

  editar(id : number){
    this.servicioService.servicioId = id
    this.router.navigateByUrl('/save' + this.location.path().substring(4, this.location.path().length + 1))
  }

  eliminar(id : number){
    this.servicioService.delete(id)
  }

}
