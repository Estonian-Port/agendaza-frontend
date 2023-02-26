import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ListaMes, Mes } from 'src/app/model/Mes';
import { PrecioForm } from 'src/app/model/Precio';
import { ExtraService } from 'src/app/services/extra.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-precio-extra',
  templateUrl: './precio-extra.component.html',
  styleUrls: ['./precio-extra.component.css']
})
export class PrecioExtraComponent implements OnInit {


  id : number = 0
  listaPrecio : Array<PrecioForm> = []
  listaMes : Array<Mes> = ListaMes
  currentYear = new Date().getFullYear();
  listaYear : Array<number> = [this.currentYear, this.currentYear + 1]

  constructor(private extraService : ExtraService, private router : Router, private location : Location) { }

  async ngOnInit(): Promise<void> {
      const listaPrecio = await this.extraService.getAllPrecioConFechaByExtraId(this.extraService.extraId)
      
      if(listaPrecio.length != 0){
        this.listaPrecio = listaPrecio
      }
  }

  volver(){
    this.router.navigateByUrl("/" + this.extraService.extraVolver)
  }

  async save(){
    const item = await this.extraService.savePrecio(this.listaPrecio)
    this.router.navigateByUrl("/" + this.extraService.extraVolver)
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
