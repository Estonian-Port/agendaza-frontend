import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as _ from 'lodash';
import { GenericItem } from 'src/app/model/GenericItem';
import { GenericItemEmpresaTipoEvento } from 'src/app/model/GenericItemEmpresaTipoEvento';
import { ServicioService } from 'src/app/services/servicio.service';
import { TipoEventoService } from 'src/app/services/tipo-evento.service';

@Component({
  selector: 'app-save-servicio',
  templateUrl: './save-servicio.component.html',
  styleUrls: ['./save-servicio.component.css']
})
export class SaveServicioComponent implements OnInit {
  
  genericItem : GenericItemEmpresaTipoEvento = new GenericItemEmpresaTipoEvento(0, "", 0, [])
  listaItems : Array<GenericItem> = []

  constructor(private servicioService : ServicioService, private tipoEventoService : TipoEventoService, private router : Router) { }
  
  async ngOnInit(): Promise<void> {
    if(this.servicioService.servicioId){
      this.genericItem = await this.servicioService.getServicio(this.servicioService.servicioId)
    }

    this.listaItems = await this.tipoEventoService.getAllTipoEventoByEmpresaId()
  }

  async save(){
    const item = await this.servicioService.save(this.genericItem)
    this.router.navigateByUrl('/abmServicio')
  }

  onCheckboxChange(event: any){
    if (event.target.checked) {
      this.genericItem.listaTipoEventoId.push(Number(event.target.value))
    } else {
      _.pull(this.genericItem.listaTipoEventoId, Number(event.target.value))
    }
  }

  isChecked(id : number){
    console.log(this.genericItem)
    if(this.genericItem.listaTipoEventoId != undefined){
      return this.genericItem.listaTipoEventoId.find(it => it == id)
    }
    else{
      return false
    }
  }
}

