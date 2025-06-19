import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as _ from 'lodash';
import { Extra } from 'src/app/model/Extra';
import { GenericItem } from 'src/app/model/GenericItem';
import { TipoEvento, TipoEventoJSON } from 'src/app/model/TipoEvento';
import { ExtraService } from 'src/app/services/extra.service';
import { TipoEventoService } from 'src/app/services/tipo-evento.service';
import { ErrorMensaje } from 'src/util/errorHandler';

@Component({
  selector: 'app-save-extra-evento',
  templateUrl: './save-extra-evento.component.html',
})
export class SaveExtraEventoComponent implements OnInit {

  extra = new Extra(0, "", "EVENTO", 0,[],0)
  listaTipoExtra : Array<string> = []
  errors = []
  error : ErrorMensaje = new ErrorMensaje(false, '')

  listaTipoEvento : Array<TipoEvento> = []

  listaTipoEventoCorto : Array<TipoEvento> = []
  listaTipoEventoMedio : Array<TipoEvento> = []
  listaTipoEventoLargo : Array<TipoEvento> = []

  titulo = "Agregar Extra"

  constructor(private extraService : ExtraService, private tipoEventoService : TipoEventoService, private router : Router) { }

  async ngOnInit(): Promise<void> {
    this.listaTipoExtra = await this.extraService.getAllEventoTipoExtra()

    if(this.extraService.extraId){
      this.extra = await this.extraService.getExtra(this.extraService.extraId)
      this.extraService.extraId = 0
    }

    this.listaTipoEvento = await this.tipoEventoService.getAllTipoEventoByEmpresaId()

    this.listaTipoEventoCorto = this.listaTipoEvento.filter(evento => evento.duracion === 'CORTO');
    this.listaTipoEventoMedio = this.listaTipoEvento.filter(evento => evento.duracion === 'MEDIO');
    this.listaTipoEventoLargo = this.listaTipoEvento.filter(evento => evento.duracion === 'LARGO');

  }

  async save(){
    const item = await this.extraService.save(this.extra)
    this.router.navigateByUrl('/abmExtraEvento')
  }

  volver(){
    this.router.navigateByUrl('/abmExtraEvento')
  }

  onCheckboxChange(event: any){
    if (event.target.checked) {
      this.extra.listaTipoEventoId.push(Number(event.target.value))
    } else {
      _.pull(this.extra.listaTipoEventoId, Number(event.target.value))
    }
  }

  isChecked(id : number){
    if(this.extra.listaTipoEventoId != undefined){
      return this.extra.listaTipoEventoId.find(it => it == id)
    }
    return false
  }

  selectAll(listaTipoEvento : Array<TipoEvento>) {
    if(!this.areAllSelected(listaTipoEvento)){
      this.extra.listaTipoEventoId = [...new Set([... this.extra.listaTipoEventoId, ...listaTipoEvento.map(it => it.id)])]
    }else{
      this.extra.listaTipoEventoId = this.extra.listaTipoEventoId.filter(item => !listaTipoEvento.some(it => it.id == item));
    }
  }

  areAllSelected(listaTipoEvento : Array<TipoEvento>) {
    if(listaTipoEvento.length === 0){
      return false
    }
    return listaTipoEvento.every(item => this.extra.listaTipoEventoId.includes(item.id))
  }
}

