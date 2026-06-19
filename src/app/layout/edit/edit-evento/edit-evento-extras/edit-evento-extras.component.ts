import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EventoExtra } from 'src/app/model/Evento';
import { Extra, ExtraVariable } from 'src/app/model/Extra';
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


    const dtoExtras = await this.extraService.getAllExtraEventoByTipoEventoIdAndFecha(this.evento.tipoEventoExtra.id, this.evento.fechaEvento, "EVENTO");
    const dtoVariables = await this.extraService.getAllExtraEventoByTipoEventoIdAndFecha(this.evento.tipoEventoExtra.id, this.evento.fechaEvento, "VARIABLE_EVENTO");

    this.listaExtra = dtoExtras.map(dto => Extra.fromDTO(dto, 0));
    this.listaExtraVariable = dtoVariables.map(dto => ExtraVariable.fromDTO(dto));

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
