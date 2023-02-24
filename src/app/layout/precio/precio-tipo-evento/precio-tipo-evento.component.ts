import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as _ from 'lodash';
import { ListaMes, Mes } from 'src/app/model/Mes';
import { Precio, PrecioForm } from 'src/app/model/Precio';
import { TipoEventoService } from 'src/app/services/tipo-evento.service';

@Component({
  selector: 'app-precio-tipo-evento',
  templateUrl: './precio-tipo-evento.component.html',
  styleUrls: ['./precio-tipo-evento.component.css']
})
export class PrecioTipoEventoComponent implements OnInit {

  id = 0
  listaPrecio : Array<PrecioForm> = [new PrecioForm(this.id,0,0,0,0)]
  listaMes : Array<Mes> = ListaMes
  currentYear = new Date().getFullYear();
  listaYear : Array<number> = [this.currentYear, this.currentYear + 1]

  constructor(private tipoEventoService : TipoEventoService, private router : Router) { }

  async ngOnInit(): Promise<void> {
      //this.listaPrecio = await this.tipoEventoService.getPrecioOfTipoEvento(this.tipoEventoService.tipoEventoId)
      //this.tipoEventoService.tipoEventoId = 0
  }

  volver(){
    this.router.navigateByUrl('/abmTipoEvento')
  }

  async save(){
    const item = await this.tipoEventoService.savePrecio(this.listaPrecio)
    this.router.navigateByUrl('/abmTipoEvento')
  }

  agregarPrecio(){
    this.id += 1
    this.listaPrecio.push(new PrecioForm(this.id,0,0,0,0))
  }

  quitarPrecio(precioSeleccionado : PrecioForm){
    this.listaPrecio = this.listaPrecio.filter(precio => precio.id !== precioSeleccionado.id);
  }

}
