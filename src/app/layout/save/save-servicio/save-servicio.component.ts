import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as _ from 'lodash';
import { fadeOut } from 'src/app/animations/fade-out';
import { GenericItem, GenericItemEmpresaTipoEvento } from 'src/app/model/GenericItem';
import { TipoEvento } from 'src/app/model/TipoEvento';
import { ServicioService } from 'src/app/services/servicio.service';
import { TipoEventoService } from 'src/app/services/tipo-evento.service';

@Component({
  selector: 'app-save-servicio',
  templateUrl: './save-servicio.component.html',
  animations: [fadeOut]
})
export class SaveServicioComponent implements OnInit {
  
  genericItem : GenericItemEmpresaTipoEvento = new GenericItemEmpresaTipoEvento(0, "", 0, [])
  
  listaTipoEvento : Array<TipoEvento> = []

  listaTipoEventoCorto : Array<TipoEvento> = []
  listaTipoEventoMedio : Array<TipoEvento> = []
  listaTipoEventoLargo : Array<TipoEvento> = []

  titulo = "Agregar Servicio"
  seleccionado = 1
  otro = false

  listaServicio : Array<GenericItem> = []

  constructor(private servicioService : ServicioService, private tipoEventoService : TipoEventoService, private router : Router) { }
  
  async ngOnInit(): Promise<void> {

    if(this.servicioService.servicioId){
      this.genericItem = await this.servicioService.getServicio(this.servicioService.servicioId)
      this.servicioService.servicioId = 0
    }else{
      this.listaServicio = await this.servicioService.getAllServicio()
    }

    this.listaTipoEvento = await this.tipoEventoService.getAllTipoEventoByEmpresaId()

    this.listaTipoEventoCorto = this.listaTipoEvento.filter(evento => evento.duracion === 'CORTO');
    this.listaTipoEventoMedio = this.listaTipoEvento.filter(evento => evento.duracion === 'MEDIO');
    this.listaTipoEventoLargo = this.listaTipoEvento.filter(evento => evento.duracion === 'LARGO');
  }

  async save(){
    const item = await this.servicioService.save(this.genericItem)
    this.router.navigateByUrl('/abmServicio')
  }

  volver(){
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
    if(this.genericItem.listaTipoEventoId != undefined){
      return this.genericItem.listaTipoEventoId.find(it => it == id)
    }
    return false
  }
  
  selectAll(listaTipoEvento : Array<TipoEvento>) {
    if(!this.areAllSelected(listaTipoEvento)){
      this.genericItem.listaTipoEventoId = [...new Set([... this.genericItem.listaTipoEventoId, ...listaTipoEvento.map(it => it.id)])]
    }else{
      this.genericItem.listaTipoEventoId = this.genericItem.listaTipoEventoId.filter(item => !listaTipoEvento.some(it => it.id == item));
    }
  }

  areAllSelected(listaTipoEvento : Array<TipoEvento>) {
    return listaTipoEvento.every(item => this.genericItem.listaTipoEventoId.includes(item.id));

  }

  onServicioChange(): void {
    console.log("asdasdasd")
    console.log(this.seleccionado)
    if (this.seleccionado == 0) {
      console.log("si")

        this.otro = true;
    } else {
        this.otro = false;
    }
}
  
}

