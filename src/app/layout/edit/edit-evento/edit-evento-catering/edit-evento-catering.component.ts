import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Capacidad } from 'src/app/model/Capacidad';
import { CateringEvento } from 'src/app/model/CateringEvento';
import { EventoCatering } from 'src/app/model/Evento';
import { Extra } from 'src/app/model/Extra';
import { ExtraVariable } from 'src/app/model/ExtraVariable';
import { FechaForm } from 'src/app/model/FechaForm';
import { EventoService } from 'src/app/services/evento.service';
import { ExtraService } from 'src/app/services/extra.service';

@Component({
  selector: 'app-edit-evento-catering',
  templateUrl: './edit-evento-catering.component.html',
  styleUrls: ['./edit-evento-catering.component.css']
})
export class EditEventoCateringComponent implements OnInit {

  evento : EventoCatering = new EventoCatering(0, "","",new CateringEvento(0,0,0,"",[],[]),0,"", new Capacidad(0,0,0))
  listaExtraTipoCatering : Array<Extra> = []
  listaExtraCateringVariable : Array<ExtraVariable> = []
  extraTipoCateringPresupuesto : number = 0
  extraCateringPresupuesto : number = 0
  cateringOtro : boolean = false

  constructor(private eventoService : EventoService, private router : Router, private extraService : ExtraService) { }

  async ngOnInit() {
    this.evento = await this.eventoService.getEventoCatering()

    const fecha = new Date(this.evento.fechaEvento)

    // TODO Reemplazar fechaForm en getAllTipo...
    this.listaExtraTipoCatering = await this.extraService.getAllTipoCateringByTipoEventoIdAndFecha(this.evento.tipoEventoId, new FechaForm(fecha.getFullYear(), fecha.getMonth(), fecha.getDate()))
    this.listaExtraCateringVariable = await this.extraService.getAllCateringExtraByTipoEventoIdAndFecha(this.evento.tipoEventoId, new FechaForm(fecha.getFullYear(), fecha.getMonth(), fecha.getDate()))


    
  }

  volver(){
    this.router.navigateByUrl("/abmEvento")
  }

  sumExtraTipoCatering(extraPrecio : number){
    this.extraTipoCateringPresupuesto += extraPrecio * this.evento.capacidad.capacidadAdultos
    this.sumCateringPresupuesto()
  }

  cleanExtraOtroCheckbox(){
    this.cateringOtro = false
    this.evento.catering.cateringOtro = 0
    this.evento.catering.descripcion = ""
    this.sumCateringPresupuesto()
  }

  sumExtraCatering(extraPrecio : number){
    this.extraCateringPresupuesto += extraPrecio
    this.sumCateringPresupuesto()
  }

  sumCateringPresupuesto(){
    if(this.cateringOtro){
      this.evento.catering.presupuesto = this.extraCateringPresupuesto + this.evento.catering.cateringOtro * this.evento.capacidad.capacidadAdultos
    }else{
      this.evento.catering.presupuesto = this.extraCateringPresupuesto + this.extraTipoCateringPresupuesto
    }
  }

}
