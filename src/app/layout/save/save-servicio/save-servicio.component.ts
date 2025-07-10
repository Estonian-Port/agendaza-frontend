import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as _ from 'lodash';
import { fadeOut } from 'src/app/animations/fade-out';
import { GenericItem, GenericItemEmpresaTipoEvento } from 'src/app/model/GenericItem';
import { ServicioService } from 'src/app/services/servicio.service';

@Component({
  selector: 'app-save-servicio',
  templateUrl: './save-servicio.component.html',
  animations: [fadeOut]
})
export class SaveServicioComponent implements OnInit {
  
  genericItem : GenericItemEmpresaTipoEvento = new GenericItemEmpresaTipoEvento(0, "", 0, [])
  listaServicio : Array<GenericItem> = []

  otro = false
  edicion = false

  constructor(private servicioService : ServicioService, private router : Router) { }
  
  async ngOnInit(): Promise<void> {

    if(this.servicioService.servicioId){
      this.genericItem = await this.servicioService.getServicio(this.servicioService.servicioId)
      this.servicioService.servicioId = 0
      this.otro = true
      this.edicion = true
    }else{
      this.listaServicio = await this.servicioService.getAllServicioAgregar()
      if(this.listaServicio.length == 0){
        this.genericItem.id = 0
        this.onServicioChange()
      }else{
        const servicioEdicion = [...this.listaServicio].sort((a, b) => a.nombre.localeCompare(b.nombre))[0];

        this.genericItem.id = servicioEdicion.id
        this.genericItem.nombre = servicioEdicion.nombre
      }
    }
  }

  async save(){
    const item = await this.servicioService.save(this.genericItem)
    this.router.navigateByUrl('/abmServicio')
  }

  volver(){
    this.router.navigateByUrl('/abmServicio')
  }

  onServicioChange(): void {
    if (this.genericItem.id == 0) {
        this.genericItem = new GenericItemEmpresaTipoEvento(0, "", 0, [])
        this.otro = true;
    } else {
        this.otro = false;
    }
  }
  
}

