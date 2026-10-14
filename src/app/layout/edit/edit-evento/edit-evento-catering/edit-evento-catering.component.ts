import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EventoCatering } from 'src/app/model/Evento';
import { Extra, ExtraVariable } from 'src/app/model/Extra';
import { EventoService } from 'src/app/services/evento.service';
import { ExtraService } from 'src/app/services/extra.service';

@Component({
  selector: 'app-edit-evento-catering',
  templateUrl: './edit-evento-catering.component.html',
})
export class EditEventoCateringComponent implements OnInit {

  evento : EventoCatering = new EventoCatering(0, "","",0,"",[],0,"",0,0)
  listaExtraTipoCatering : Array<Extra> = []
  listaExtraCateringVariable : Array<ExtraVariable> = []
  extrasTipoCateringSeleccionados : Array<Extra> = []
  extrasVariablesCateringSeleccionados : Array<ExtraVariable> = []
  cargandoExtras = true
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
    this.evento.listaExtra ??= []

    const dtoExtras = await this.extraService.getAllExtraEventoByTipoEventoIdAndFecha(this.evento.tipoEventoId, this.evento.fechaEvento, "TIPO_CATERING");
    const dtoVariables = await this.extraService.getAllExtraEventoByTipoEventoIdAndFecha(this.evento.tipoEventoId, this.evento.fechaEvento, "VARIABLE_CATERING");

    this.listaExtraTipoCatering = dtoExtras.map(dto => Extra.fromDTO(dto, 0));
    this.listaExtraCateringVariable = dtoVariables.map(dto => ExtraVariable.fromDTO(dto));

    this.extrasTipoCateringSeleccionados = this.evento.listaExtra
      .filter(extraDTO => extraDTO.tipoExtra === "TIPO_CATERING")
      .map(extraDTO => {
        const extra = this.listaExtraTipoCatering.find(item => item.id === extraDTO.id)
          ?? new Extra(extraDTO.id, extraDTO.nombre, extraDTO.tipoExtra, extraDTO.empresaId, extraDTO.listaTipoEventoId ?? [], extraDTO.precio);
        extra.precio = extraDTO.precio;
        extra.empresaId = extraDTO.empresaId;
        extra.listaTipoEventoId = extraDTO.listaTipoEventoId ?? [];
        return extra;
      });
    this.extrasVariablesCateringSeleccionados = this.evento.listaExtra
      .filter(extraDTO => extraDTO.tipoExtra === "VARIABLE_CATERING")
      .map(extraDTO => {
        const extra = this.listaExtraCateringVariable.find(item => item.id === extraDTO.id)
          ?? new ExtraVariable(extraDTO.id, extraDTO.nombre, extraDTO.cantidad ?? 1, extraDTO.precio);
        extra.precio = extraDTO.precio;
        extra.cantidad = extraDTO.cantidad ?? 1;
        return extra;
      });

    this.extraTipoCateringPresupuesto = this.extrasTipoCateringSeleccionados
      .reduce((total, extra) => total + extra.precio * this.evento.capacidadAdultos, 0);
    this.extraCateringPresupuesto = this.extrasVariablesCateringSeleccionados
      .reduce((total, extra) => total + extra.precio * extra.cantidad, 0);

    if(this.evento.cateringOtro != 0){
      this.cateringOtro = true
      this.sumCateringPresupuesto()
    }
    this.cargandoExtras = false
  }

  volver(){
    this.location.back()
  }

  save(){
    this.evento.listaExtra = [
      ...this.extrasTipoCateringSeleccionados.map(extra => ({
        id: extra.id,
        nombre: extra.nombre,
        tipoExtra: extra.tipoExtra,
        empresaId: extra.empresaId,
        precio: extra.precio,
        cantidad: 1,
        listaTipoEventoId: extra.listaTipoEventoId ?? []
      })),
      ...this.extrasVariablesCateringSeleccionados.map(extra => ({
        id: extra.id,
        nombre: extra.nombre,
        tipoExtra: "VARIABLE_CATERING",
        empresaId: 0,
        precio: extra.precio,
        cantidad: extra.cantidad,
        listaTipoEventoId: []
      }))
    ];
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
      this.extrasTipoCateringSeleccionados.splice(0);
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
