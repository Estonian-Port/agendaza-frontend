import { Component, Input } from '@angular/core';
import * as _ from 'lodash';
import { GenericItemEmpresaTipoEvento } from 'src/app/model/GenericItem';
import { TipoEvento } from 'src/app/model/TipoEvento';
import { TipoEventoService } from 'src/app/services/tipo-evento.service';

@Component({
  selector: 'app-tipo-evento-seleccionador',
  templateUrl: './tipo-evento-seleccionador.component.html'
})
export class TipoEventoSeleccionadorComponent {

  @Input()
  genericItem! : GenericItemEmpresaTipoEvento

  listaTipoEvento : Array<TipoEvento> = []

  listaTipoEventoCorto : Array<TipoEvento> = []
  listaTipoEventoMedio : Array<TipoEvento> = []
  listaTipoEventoLargo : Array<TipoEvento> = []
  
  constructor(private tipoEventoService : TipoEventoService){}

  async ngOnInit(): Promise<void> {
    this.listaTipoEvento = await this.tipoEventoService.getAllTipoEventoByEmpresaId()

    this.listaTipoEventoCorto = this.listaTipoEvento.filter(evento => evento.duracion === 'CORTO');
    this.listaTipoEventoMedio = this.listaTipoEvento.filter(evento => evento.duracion === 'MEDIO');
    this.listaTipoEventoLargo = this.listaTipoEvento.filter(evento => evento.duracion === 'LARGO');
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

}
