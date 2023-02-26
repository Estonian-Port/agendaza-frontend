import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as _ from 'lodash';
import { ListaMes, Mes } from 'src/app/model/Mes';
import { PrecioForm } from 'src/app/model/Precio';
import { TipoEventoService } from 'src/app/services/tipo-evento.service';

@Component({
  selector: 'app-precio-tipo-evento',
  templateUrl: './precio-tipo-evento.component.html',
  styleUrls: ['./precio-tipo-evento.component.css']
})
export class PrecioTipoEventoComponent implements OnInit {

  id : number = 0
  listaPrecio : Array<PrecioForm> = []
  listaMes : Array<Mes> = ListaMes
  currentYear = new Date().getFullYear();
  listaYear : Array<number> = [this.currentYear, this.currentYear + 1]

  constructor(private tipoEventoService : TipoEventoService, private router : Router) { }

  async ngOnInit(): Promise<void> {
      const listaPrecio = await this.tipoEventoService.getAllPrecioConFechaByTipoEventoId(this.tipoEventoService.tipoEventoId)
      
      if(listaPrecio.length != 0){
        this.listaPrecio = listaPrecio
      }
  }

  volver(){
    this.router.navigateByUrl('/abmTipoEvento')
  }

  async save(){
    const item = await this.tipoEventoService.savePrecio(this.listaPrecio)
    this.router.navigateByUrl('/abmTipoEvento')
  }

  agregarPrecio(){
    this.id -=1
    this.listaPrecio.push(new PrecioForm(this.id,0,0,0,0))
    console.log
  }

  quitarPrecio(precioSeleccionado : PrecioForm){
    this.listaPrecio = this.listaPrecio.filter(precio => precio.id !== precioSeleccionado.id);
  }

}
