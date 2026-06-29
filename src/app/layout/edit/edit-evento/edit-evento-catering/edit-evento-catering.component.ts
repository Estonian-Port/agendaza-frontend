import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Capacidad } from 'src/app/model/Capacidad';
import { EventoCatering } from 'src/app/model/Evento';
import { Extra, ExtraVariable } from 'src/app/model/Extra';
import { FechaForm } from 'src/app/model/FechaForm';
import { EventoService } from 'src/app/services/evento.service';
import { ExtraService } from 'src/app/services/extra.service';

@Component({
  selector: 'app-edit-evento-catering',
  templateUrl: './edit-evento-catering.component.html',
})
export class EditEventoCateringComponent implements OnInit {

  evento : EventoCatering = new EventoCatering(0, "","",0,"",[],[],0,"",0,0)
  listaExtraTipoCatering : Array<Extra> = []
  listaExtraCateringVariable : Array<ExtraVariable> = []
  extraTipoCateringPresupuesto : number = 0
  extraCateringPresupuesto : number = 0
  cateringOtro : boolean = false
  agregarCatering : boolean = true
  presupuestoCatering : number = 0

  constructor(
    private eventoService : EventoService,
    private extraService : ExtraService,
    private route: ActivatedRoute,
    private location: Location) { }

  async ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    this.evento = await this.eventoService.getEventoCatering(id)

    const dtoExtras = await this.extraService.getAllExtraEventoByTipoEventoIdAndFecha(this.evento.tipoEventoId, this.evento.fechaEvento, "TIPO_CATERING");
    const dtoVariables = await this.extraService.getAllExtraEventoByTipoEventoIdAndFecha(this.evento.tipoEventoId, this.evento.fechaEvento, "VARIABLE_CATERING");

    this.listaExtraTipoCatering = dtoExtras.map(dto => Extra.fromDTO(dto, 0));
    this.listaExtraCateringVariable = dtoVariables.map(dto => ExtraVariable.fromDTO(dto));

    if(this.evento.cateringOtro != 0){
      this.cateringOtro = true
      this.sumCateringPresupuesto()
    }
  }

  volver(){
    this.location.back()
  }

  save(){
    this.eventoService.editEventoCatering(this.evento)
    this.volver()
  }

  sumExtraTipoCatering(extraPrecio : number){
    this.extraTipoCateringPresupuesto += extraPrecio * this.evento.capacidadAdultos
    this.sumCateringPresupuesto()
  }

  cleanTipoCateringForCateringOtro() {
    if (this.cateringOtro) {
      // Cuando se TILDA: Limpiamos la lista de tipo catering normal
      this.evento.listaExtraTipoCatering.splice(0);
      this.extraTipoCateringPresupuesto = 0;
      this.sumExtraTipoCatering(0);
    } else {
      // Cuando se DESTILDA: Limpiamos los datos del catering otro personalizado
      this.evento.cateringOtro = 0;
      this.evento.cateringOtroDescripcion = "";
      this.sumCateringPresupuesto();
    }
  }

  cleanExtraOtroCheckbox(){
    this.cateringOtro = false
    this.evento.cateringOtro = 0
    this.evento.cateringOtroDescripcion = ""
    this.sumCateringPresupuesto()
  }

  sumExtraCatering(extraPrecio : number){
    this.extraCateringPresupuesto += extraPrecio
    this.sumCateringPresupuesto()
  }

  sumCateringPresupuesto(){
    if(this.cateringOtro){
      this.presupuestoCatering = this.extraCateringPresupuesto + this.evento.cateringOtro * this.evento.capacidadAdultos
    }else{
      this.presupuestoCatering = this.extraCateringPresupuesto + this.extraTipoCateringPresupuesto
    }
  }
}
