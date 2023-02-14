import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import * as _ from 'lodash';
import { DynamicFormFieldModel } from 'src/app/model/DynamicFormFieldModel';
import { GenericItem } from 'src/app/model/GenericItem';
import { GenericItemEmpresa } from 'src/app/model/GenericItemEmpresa';
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
    this.listaItems = await this.tipoEventoService.getAllTipoEventoByEmpresaId()
  }

  async save(){
    const item = await this.servicioService.saveServicio(this.genericItem)
    this.router.navigateByUrl('/abmServicio')
  }

  onCheckboxChange(event: any){
    if (event.target.checked) {
      this.genericItem.listaTipoEventoId.push(event.target.value)
    } else {
      _.pull(this.genericItem.listaTipoEventoId, event.target.value)
    }
  }

}
