import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EventoExtra } from 'src/app/model/Evento';
import { Extra } from 'src/app/model/Extra';
import { ExtraVariable } from 'src/app/model/ExtraVariable';
import { FechaForm } from 'src/app/model/FechaForm';
import { TipoEventoExtra } from 'src/app/model/TipoEvento';
import { EventoService } from 'src/app/services/evento.service';
import { ExtraService } from 'src/app/services/extra.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-edit-evento-extras',
  templateUrl: './edit-evento-extras.component.html',
})
export class EditEventoExtrasComponent implements OnInit {

  evento : EventoExtra = new EventoExtra(0, "","",0,0,[],[], new TipoEventoExtra(0,"",0), "")
  listaExtra : Array<Extra> = []
  listaExtraVariable : Array<ExtraVariable> = []
  extraPresupuesto : number = 0
  presupuesto = 0
  
  constructor(
    private eventoService : EventoService, 
    private router : Router, 
    private extraService : ExtraService, 
    private route: ActivatedRoute,
    private location: Location) { }

  async ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    this.evento = await this.eventoService.getEventoExtra(id)

    const fecha = new Date(this.evento.fechaEvento)
    this.listaExtra = await this.extraService.getAllExtraEventoByTipoEventoIdAndFecha(this.evento.tipoEventoExtra.id, new FechaForm(fecha.getFullYear(), fecha.getMonth(), fecha.getDate()))
    this.listaExtraVariable = await this.extraService.getAllExtraEventoVariableByTipoEventoIdAndFecha(this.evento.tipoEventoExtra.id, new FechaForm(fecha.getFullYear(), fecha.getMonth(), fecha.getDate()))
    
    this.sumPresupuesto()
  }

  volver(){
    this.location.back()
  }

  save(){
    this.eventoService.editEventoExtra(this.evento)
    this.volver()
  }

  sumExtraPresupuesto(extraPrecio : number){
    this.extraPresupuesto += extraPrecio
    this.sumPresupuesto()
  }

  sumPresupuesto(){
    this.presupuesto = this.evento.tipoEventoExtra.precio + this.extraPresupuesto + this.evento.extraOtro

    if(this.evento.descuento != 0){
      this.presupuesto -= this.presupuesto * (this.evento.descuento / 100)
    }
  }
}
