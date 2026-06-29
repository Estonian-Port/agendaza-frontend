import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TipoEvento } from 'src/app/model/TipoEvento';
import { TipoEventoService } from 'src/app/services/tipo-evento.service';

@Component({
  selector: 'app-save-tipo-evento',
  templateUrl: './save-tipo-evento.component.html',
})
export class SaveTipoEventoComponent implements OnInit {

  tipoEvento : TipoEvento = new TipoEvento(0,"","","CORTO",0,0, 0)
  listaDuracion : Array<string> = []
  tipoEventoId : number = 0

  constructor(
    private tipoEventoService : TipoEventoService,
    private route: ActivatedRoute,
    private location : Location
  ) { }
  
  async ngOnInit() {
    await this.route.queryParams.subscribe(async params => {
      
      if (params['tipoEventoId']) {
        const tipoEventoId = Number(params['tipoEventoId']);
        this.tipoEvento = await this.tipoEventoService.getTipoEvento(tipoEventoId)
      }

      this.listaDuracion = await this.tipoEventoService.getAllDuracion()
    })
  }

  async save(){
    const item = await this.tipoEventoService.save(this.tipoEvento)
    this.volver()
  }

  volver(){
    this.location.back()
  }

}
