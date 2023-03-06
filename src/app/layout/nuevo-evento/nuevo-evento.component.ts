import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash';
import { Agregados } from 'src/app/model/Agregados';
import { Capacidad } from 'src/app/model/Capacidad';
import { CateringEvento } from 'src/app/model/CateringEvento';
import { DateUtil, Mes } from 'src/app/model/DateUtil';
import { Evento } from 'src/app/model/Evento';
import { Extra } from 'src/app/model/Extra';
import { ExtraVariable } from 'src/app/model/ExtraVariable';
import { FechaForm } from 'src/app/model/FechaForm';
import { GenericItem } from 'src/app/model/GenericItem';
import { Time } from 'src/app/model/Time';
import { TipoEvento } from 'src/app/model/TipoEvento';
import { Cliente } from 'src/app/model/Usuario';
import { EmpresaService } from 'src/app/services/empresa.service';
import { EventoService } from 'src/app/services/evento.service';
import { ExtraService } from 'src/app/services/extra.service';
import { ServicioService } from 'src/app/services/servicio.service';
import { TipoEventoService } from 'src/app/services/tipo-evento.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { ErrorMensaje, mostrarErrorConMensaje } from 'src/util/errorHandler';

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
    new Cliente(0,0,"","","CLIENTE","",0), 0)

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
  listaHora : Array<string> = DateUtil.ListaHora
  listaMinuto : Array<string> = DateUtil.ListaMinuto
  inicioTime : Time = new Time("00","00")
  finalTime : Time = new Time("00","00")
  hastaElOtroDiaCheckbox : boolean = false

  // -- Reemplazar por TipoEventoForm
  precioTipoEvento : number = 0
  duracionTipoEvento : Time = new Time("00","00")
  capacidadTipoEvento : Capacidad = new Capacidad(0,0,0)

  // Cotizacion
  listaExtra : Array<Extra> = []
  listaExtraVariable : Array<ExtraVariable> = []
  extraPresupuesto : number = 0
  extraCamarera : ExtraVariable = new ExtraVariable(0,"",0,0)
  extraNino : ExtraVariable = new ExtraVariable(0,"",0,0)

  // Catering
  listaExtraTipoCatering : Array<Extra> = []
  listaExtraCateringVariable : Array<ExtraVariable> = []
  agregarCatering : boolean = false
  cateringOtro : boolean = false
  extraTipoCateringPresupuesto : number = 0
  extraCateringPresupuesto : number = 0

  // Datos del contacto
  listaSexo : Array<string> = []

  // Errors
  errors = []
  error : ErrorMensaje = new ErrorMensaje(false, '')
  usuarioCondicional : boolean = false

  // -------------------------- Inicializacion --------------------------------

  constructor(public tipoEventoService : TipoEventoService, public servicioSerice : ServicioService, 
    public empresaService : EmpresaService, public extraService : ExtraService, public usuarioService : UsuarioService,
    public eventoService : EventoService) { }

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

  // ---------------------------------------------------------------------------

  // ------------------------ Datos del Evento ---------------------------------

  async filterTipoEventoByDuracion(){
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

    // Datos del evento
    this.cleanEvento()
    this.duracionTipoEvento = await this.tipoEventoService.getDuracionByTipoEventoId(this.evento.tipoEventoId)
    this.capacidadTipoEvento = await this.tipoEventoService.getCapacidadByTipoEventoId(this.evento.tipoEventoId)
    
    // Cotizacion
    this.extraCamarera = await this.tipoEventoService.findExtraCamareraByTipoEventoId(this.evento.tipoEventoId)
    this.extraNino = await this.tipoEventoService.findExtraNinoByTipoEventoId(this.evento.tipoEventoId)

    this.changeTime()
    this.changeDate()

    // Tipo de evento
    this.listaServicio = await this.servicioSerice.getAllServicioByTipoEventoId(this.evento.tipoEventoId)

    this.setListasExtra()

    this.changeCapacidadAdultos()
    this.changeCapacidadNinos()
  }

  getAllDaysOfMonth(year : number, mes: number){
    this.listaDia = DateUtil.getAllDaysOfMonth(year, mes)
  }

  async changeDate(){
    this.precioTipoEvento = await this.tipoEventoService.getPrecioByTipoEventoIdAndFecha(this.evento.tipoEventoId, this.fechaEvento)
    this.setListasExtra()
    this.sumPresupuesto()
  }

  async changeTime(){
    this.finalTime = await this.tipoEventoService.getTimeEndByTipoEventoIdAndTimeStart(this.evento.tipoEventoId, this.inicioTime)
    this.hastaElOtroDiaCheckbox = Number(this.finalTime.hour) < Number(this.inicioTime.hour)
  }

  cleanEvento(){
    this.evento = new Evento(0,this.evento.nombre, "", this.evento.inicio, this.evento.fin, this.evento.tipoEventoId, 
    this.evento.capacidad, 0, new Agregados(0,0,0,[],[]), new CateringEvento(0,0,0,"",[],[]), this.evento.cliente, 0)
  }

  async changeCapacidadAdultos(){
    this.sumCateringPresupuesto()

    // Extra Camarera
    const capacidad = this.evento.capacidad.capacidadAdultos - this.capacidadTipoEvento.capacidadAdultos
    
    const extraCamareraInAgregados = this.evento.agregados.listaExtraVariable.find(i => i.id === this.extraCamarera.id)
    const extraCamareraInLista = this.listaExtraVariable.find(i => i.id === this.extraCamarera.id)

    // Por cada 10 adultos de mas se agrega una camarera
    if(capacidad >= 10){

      const cantidadCamareras = Math.trunc(capacidad / 10)
      
      // Si aun no esta en el array se agrega, sino nada mas se le setea la cantidad correcta
      if(extraCamareraInAgregados == null){
        extraCamareraInLista!!.cantidad = cantidadCamareras
        this.evento.agregados.listaExtraVariable.push(extraCamareraInLista!!)
      }else{
        const index = this.evento.agregados.listaExtraVariable.indexOf(extraCamareraInAgregados)
        this.evento.agregados.listaExtraVariable[index].cantidad = cantidadCamareras
      }
    }else{
      if(extraCamareraInAgregados != null){
        extraCamareraInAgregados.cantidad = 0
        _.pull(this.evento.agregados.listaExtraVariable, extraCamareraInAgregados)
      }
    }

  }

  async changeCapacidadNinos(){
    // Extra Ninos
    const capacidad = this.evento.capacidad.capacidadNinos - this.capacidadTipoEvento.capacidadNinos

    const extraNinoInAgregados = this.evento.agregados.listaExtraVariable.find(i => i.id === this.extraNino.id)
    const extraNinoInLista = this.listaExtraVariable.find(i => i.id === this.extraNino.id)

    // Por cada nino de mas se agrega un extra nino
    if(capacidad >= 1){

      // Si aun no esta en el array se agrega, sino nada mas se le setea la cantidad correcta
      if(extraNinoInAgregados == null){
        extraNinoInLista!!.cantidad = capacidad
        this.evento.agregados.listaExtraVariable.push(extraNinoInLista!!)
      }else{
        const index = this.evento.agregados.listaExtraVariable.indexOf(extraNinoInAgregados)
        this.evento.agregados.listaExtraVariable[index].cantidad = capacidad
      }
    }else{
      if(extraNinoInAgregados != null){
        extraNinoInAgregados!!.cantidad = 0
        _.pull(this.evento.agregados.listaExtraVariable, extraNinoInAgregados)
      }
    }
  }

  // -------------------------------------------------------------------------
  
  // --------------------------- Cotizacion ----------------------------------

  async setListasExtra(){

    // Cotizacion
    this.listaExtra = await this.extraService.getAllExtraEventoByTipoEventoIdAndFecha(this.evento.tipoEventoId, this.fechaEvento)
    this.listaExtraVariable = await this.extraService.getAllExtraEventoVariableByTipoEventoIdAndFecha(this.evento.tipoEventoId, this.fechaEvento)

    // Catering
    this.listaExtraTipoCatering = await this.extraService.getAllTipoCateringByTipoEventoIdAndFecha(this.evento.tipoEventoId, this.fechaEvento)
    this.listaExtraCateringVariable = await this.extraService.getAllCateringExtraByTipoEventoIdAndFecha(this.evento.tipoEventoId, this.fechaEvento)
  }

  sumExtraPresupuesto(extraPrecio : number){
    this.extraPresupuesto += extraPrecio
    this.sumPresupuesto()
  }

  sumPresupuesto(){
    if(this.evento.agregados.descuento == 0){
      this.evento.presupuesto = this.precioTipoEvento + this.extraPresupuesto + this.evento.agregados.extraOtro
    }else{
      this.evento.presupuesto = (this.precioTipoEvento + this.extraPresupuesto + this.evento.agregados.extraOtro) * (this.evento.agregados.descuento / 100)
    }
  }

  // ---------------------------------------------------------------------------

  // ----------------------------- Catering ---------------------------------

  sumExtraTipoCatering(extraPrecio : number){
    this.extraTipoCateringPresupuesto += extraPrecio * this.evento.capacidad.capacidadAdultos
    this.sumCateringPresupuesto()
  }

  cleanTipoCateringForCateringOtro(){
    if(this.cateringOtro){
      this.evento.catering.listaExtraTipoCatering.splice(0)
      this.extraTipoCateringPresupuesto = 0
      this.sumExtraTipoCatering(0)
    }
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

  // ---------------------------------------------------------------------------

  // --------------------------- Datos de contacto -----------------------------

  async buscarClientePorDni(){
    try {
      this.evento.cliente = await this.eventoService.buscarClientePorDni(this.evento.cliente.dni)
      this.usuarioEncontrado()
    } catch (error) {
      this.evento.cliente = new Cliente(0, this.evento.cliente.dni, "", "", "CLIENTE", "", 0)
      this.usuarioNoEncontrado(error)
    }
  }

  async buscarClientePorEmail(){
    try {
      this.evento.cliente = await this.eventoService.buscarClientePorEmail(this.evento.cliente.email)
      this.usuarioEncontrado()
    } catch (error) {
      this.evento.cliente = new Cliente(0, 0, "", "", "CLIENTE", this.evento.cliente.email, 0)
      this.usuarioNoEncontrado(error)
    }
  }

  async buscarClientePorCelular(){
    try {
      this.evento.cliente = await this.eventoService.buscarClientePorCelular(this.evento.cliente.celular)
      this.usuarioEncontrado()
    } catch (error) {
      this.evento.cliente = new Cliente(0, 0, "", "", "CLIENTE", "", this.evento.cliente.celular)
      this.usuarioNoEncontrado(error)

    }
  }

  usuarioEncontrado(){
    this.error.condicional = false
    this.usuarioCondicional = true
  }
  
  usuarioNoEncontrado(error : any){
    this.error.condicional = true
    this.usuarioCondicional = false

    mostrarErrorConMensaje(this, error)
    this.errors.forEach(error => { this.error.mensaje = error })
  }

  // --------------------------------------------------------------------------

  // --------------------------- Stepper functions ----------------------------

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

  // ---------------------------------------------------------------------------

}
