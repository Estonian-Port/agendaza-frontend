import { Component, OnInit } from '@angular/core';
import { AgendaCard } from 'src/app/model/Agenda';
import { Agregados } from 'src/app/model/Agregados';
import { Capacidad } from 'src/app/model/Capacidad';
import { CateringEvento } from 'src/app/model/CateringEvento';
import { DateUtil, Mes } from 'src/app/model/DateUtil';
import { Evento } from 'src/app/model/Evento';
import { FechaForm } from 'src/app/model/FechaForm';
import { GenericItem } from 'src/app/model/GenericItem';
import { TipoEvento } from 'src/app/model/TipoEvento';
import { Cliente } from 'src/app/model/Usuario';
import { EmpresaService } from 'src/app/services/empresa.service';
import { ExtraService } from 'src/app/services/extra.service';
import { ServicioService } from 'src/app/services/servicio.service';
import { TipoEventoService } from 'src/app/services/tipo-evento.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-nuevo-evento',
  templateUrl: './nuevo-evento.component.html',
  styleUrls: ['./nuevo-evento.component.css']
})
export class NuevoEventoComponent implements OnInit {
  
  step : number = 1
  listaStepBox : Array<GenericItem> = [
    new GenericItem(1, "Tipo de evento"),
    new GenericItem(2, "Datos del evento"),
    new GenericItem(3, "Cotizacion"),
    new GenericItem(4, "Catering"),
    new GenericItem(5, "Datos de contacto")
  ]

  evento : Evento = new Evento(0,"","", new Date(), new Date(), 0, new Capacidad(0,0,0), 0, 
    new Agregados(0,0,0,[],[]), new CateringEvento(0,0,0,"",[],[]), 
    new Cliente(0,0,"","","MASCULINO","CLIENTE","",0))

  // Tipo de evento
  listaDuracion : Array<string> = []
  listaTipoEvento : Array<TipoEvento> = []
  listaServicio : Array<GenericItem> = []
  duracionSeleccionada : string = "CORTO"

  // Datos del evento
  empresa : GenericItem = new GenericItem(0,"")
  listaDia : Array<number> = []
  listaMes : Array<Mes> = DateUtil.ListaMes
  currentYear = new Date().getFullYear()
  listaYear : Array<number> = [this.currentYear, this.currentYear + 1]
  fechaEvento : FechaForm = new FechaForm(this.currentYear,0,1)
  listaHora : Array<number> = DateUtil.ListaHora
  listaMinuto : Array<number> = DateUtil.ListaMinuto

  // Cotizacion
  listaExtra : Array<GenericItem> = []
  listaExtraVariable : Array<GenericItem> = []

  // Catering
  listaExtraTipoCatering : Array<GenericItem> = []
  listaExtraCateringVariable : Array<GenericItem> = []
  agregarCatering : boolean = false
  cateringOtro : boolean = false

  // Datos del contacto
  listaSexo : Array<string> = []

  constructor(public tipoEventoService : TipoEventoService, public servicioSerice : ServicioService, 
    public empresaService : EmpresaService, public extraService : ExtraService, public usuarioService : UsuarioService) { }

  async ngOnInit(): Promise<void> {
    // Tipo de evento
    this.listaDuracion = await this.tipoEventoService.getAllDuracion()
    this.empresa = await this.empresaService.getEmpresa()
    this.filterTipoEventoByDuracion()

    // Datos del evento
    this.listaDia = DateUtil.getAllDaysOfMonth(this.currentYear, 0)

    // Datos del contacto
    this.listaSexo = await this.usuarioService.getAllSexo()
  }

  async filterTipoEventoByDuracion(){
    console.log(this.evento)

    // Tipo de evento
    this.listaTipoEvento = await this.tipoEventoService.getAllTipoEventoByDuracion(this.duracionSeleccionada)
    
    this.listaServicio =[]

    // Cotizacion
    this.listaExtra = []
    this.listaExtraVariable = []
    
    // Catering
    this.listaExtraTipoCatering = []
    this.listaExtraCateringVariable = []

    this.cleanEvento()
  }

  async inicializarByTipoEventoId(){
    this.cleanEvento()

    // Tipo de evento
    this.listaServicio = await this.servicioSerice.getAllServicioByTipoEventoId(this.evento.tipoEventoId)

    // Cotizacion
    this.listaExtra = await this.extraService.getAllExtraEventoByTipoEventoId(this.evento.tipoEventoId)
    this.listaExtraVariable = await this.extraService.getAllExtraEventoVariableByTipoEventoId(this.evento.tipoEventoId)

    // Catering
    this.listaExtraTipoCatering = await this.extraService.getAllTipoCateringByTipoEventoId(this.evento.tipoEventoId)
    this.listaExtraCateringVariable = await this.extraService.getAllCateringExtraByTipoEventoId(this.evento.tipoEventoId)
  }

  cleanEvento(){
    this.evento = new Evento(0,this.evento.nombre, "", this.evento.inicio, this.evento.fin, this.evento.tipoEventoId, 
      this.evento.capacidad, 0, new Agregados(0,0,0,[],[]), new CateringEvento(0,0,0,"",[],[]), this.evento.cliente)
  }

  getAllDaysOfMonth(year : number, mes: number){
    this.listaDia = DateUtil.getAllDaysOfMonth(year, mes)
  }


  isStep(step : number) : boolean{
    return this.step == step
  }

  get myIsStep() {
    return this.isStep.bind(this);
  }

  siguiente(){
    if(this.step >= 1 && this.step < 5){
      this.step = this.step + 1
    }
  }

  atras(){
    if(this.step > 1 && this.step <= 5){
      this.step = this.step - 1
    }
  }

}
