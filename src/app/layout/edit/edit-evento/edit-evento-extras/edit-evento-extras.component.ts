import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EventoExtra } from 'src/app/model/Evento';
import { Extra, ExtraVariable } from 'src/app/model/Extra';
import { TipoEventoExtra } from 'src/app/model/TipoEvento';
import { EventoService } from 'src/app/services/evento.service';
import { ExtraService } from 'src/app/services/extra.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-edit-evento-extras',
  templateUrl: './edit-evento-extras.component.html',
})
export class EditEventoExtrasComponent implements OnInit {

  evento : EventoExtra = new EventoExtra(0, "","",0,"",[], new TipoEventoExtra(0,"",0), "")
  listaExtra : Array<Extra> = []
  listaExtraVariable : Array<ExtraVariable> = []
  extrasSeleccionados : Array<Extra> = []
  extrasVariablesSeleccionados : Array<ExtraVariable> = []
  cargandoExtras = true
  extraPresupuesto : number = 0
  presupuesto = 0
  
  constructor(
    private eventoService : EventoService, 
    private extraService : ExtraService, 
    private route: ActivatedRoute,
    private location: Location) { }

  async ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    this.evento = await this.eventoService.getEventoExtra(id)
    this.evento.listaEventoExtra ??= []

    const dtoExtras = await this.extraService.getAllExtraEventoByTipoEventoIdAndFecha(this.evento.tipoEventoExtra.id, this.evento.fechaEvento, "EVENTO");
    const dtoVariables = await this.extraService.getAllExtraEventoByTipoEventoIdAndFecha(this.evento.tipoEventoExtra.id, this.evento.fechaEvento, "VARIABLE_EVENTO");

    this.listaExtra = dtoExtras.map(dto => Extra.fromDTO(dto, 0));
    this.listaExtraVariable = dtoVariables.map(dto => ExtraVariable.fromDTO(dto));

    this.extrasSeleccionados = this.evento.listaEventoExtra
      .filter(extraDTO => extraDTO.tipoExtra !== "VARIABLE_EVENTO")
      .map(extraDTO => {
        const extra = this.listaExtra.find(item => item.id === extraDTO.id)
          ?? new Extra(extraDTO.id, extraDTO.nombre, extraDTO.tipoExtra, extraDTO.empresaId, extraDTO.listaTipoEventoId ?? [], extraDTO.precio);
        extra.precio = extraDTO.precio;
        extra.empresaId = extraDTO.empresaId;
        extra.listaTipoEventoId = extraDTO.listaTipoEventoId ?? [];
        return extra;
      });
    this.extrasVariablesSeleccionados = this.evento.listaEventoExtra
      .filter(extraDTO => extraDTO.tipoExtra === "VARIABLE_EVENTO")
      .map(extraDTO => {
        const extra = this.listaExtraVariable.find(item => item.id === extraDTO.id)
          ?? new ExtraVariable(extraDTO.id, extraDTO.nombre, extraDTO.cantidad ?? 1, extraDTO.precio);
        extra.precio = extraDTO.precio;
        extra.cantidad = extraDTO.cantidad ?? 1;
        return extra;
      });
    this.extraPresupuesto = this.extrasSeleccionados.reduce((total, extra) => total + extra.precio, 0)
      + this.extrasVariablesSeleccionados.reduce((total, extra) => total + extra.precio * extra.cantidad, 0);

    this.sumPresupuesto()
    this.cargandoExtras = false
  }

  volver(){
    this.location.back()
  }

  save(){
    this.evento.listaEventoExtra = [
      ...this.extrasSeleccionados.map(extra => ({
        id: extra.id,
        nombre: extra.nombre,
        tipoExtra: extra.tipoExtra,
        empresaId: extra.empresaId,
        precio: extra.precio,
        cantidad: 1,
        listaTipoEventoId: extra.listaTipoEventoId ?? []
      })),
      ...this.extrasVariablesSeleccionados.map(extra => ({
        id: extra.id,
        nombre: extra.nombre,
        tipoExtra: "VARIABLE_EVENTO",
        empresaId: 0,
        precio: extra.precio,
        cantidad: extra.cantidad,
        listaTipoEventoId: []
      }))
    ];
    this.eventoService.editEventoExtra(this.evento)
    this.volver()
  }

  sumExtraPresupuesto(extraPrecio : number){
    this.extraPresupuesto += extraPrecio
    this.sumPresupuesto()
  }

  sumPresupuesto(){
    this.presupuesto = this.evento.tipoEventoExtra.precio + this.extraPresupuesto + this.evento.extraOtro
  }
}
