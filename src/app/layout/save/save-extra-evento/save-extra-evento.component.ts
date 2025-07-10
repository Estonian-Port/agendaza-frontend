import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as _ from 'lodash';
import { fadeOut } from 'src/app/animations/fade-out';
import { Extra } from 'src/app/model/Extra';
import { GenericItemEmpresaTipoEvento } from 'src/app/model/GenericItem';
import { ExtraService } from 'src/app/services/extra.service';

@Component({
  selector: 'app-save-extra-evento',
  templateUrl: './save-extra-evento.component.html',
  animations: [fadeOut]
})
export class SaveExtraEventoComponent implements OnInit {

  extra = new Extra(0, "", "EVENTO", 0,[],0)
  listaExtra : Array<GenericItemEmpresaTipoEvento> = []
  listaTipoExtra : Array<string> = []

  otro = false
  edicion = false

  constructor(private extraService : ExtraService, private router : Router) { }

  async ngOnInit(): Promise<void> {
    this.listaTipoExtra = await this.extraService.getAllEventoTipoExtra()

    if(this.extraService.extraId){
      this.extra = await this.extraService.getExtra(this.extraService.extraId)
      this.extraService.extraId = 0
      this.otro = true
      this.edicion = true
    }else{
      this.listaExtra = await this.extraService.getAllExtraEventoAgregar()
      if(this.listaExtra.length == 0){
        this.extra.id = 0
        this.onServicioChange()
      }else{
        const extraEdicion = [...this.listaExtra].sort((a, b) => a.nombre.localeCompare(b.nombre))[0]

        this.extra.id = extraEdicion.id
        this.extra.nombre = extraEdicion.nombre
      }
    }
  }

  async save(){
    const item = await this.extraService.save(this.extra)
    this.router.navigateByUrl('/abmExtraEvento')
  }

  volver(){
    this.router.navigateByUrl('/abmExtraEvento')
  }

  onServicioChange(): void {
    if (this.extra.id == 0) {
        this.extra = new Extra(0, "", "EVENTO", 0,[],0)
        this.otro = true;
    } else {
        this.otro = false;
    }
  }
}

