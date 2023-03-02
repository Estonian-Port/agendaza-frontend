import { Component, OnInit } from '@angular/core';
import { end } from '@popperjs/core';
import { Agregados } from 'src/app/model/Agregados';
import { Capacidad } from 'src/app/model/Capacidad';
import { CateringEvento } from 'src/app/model/CateringEvento';
import { DateUtil, Mes } from 'src/app/model/DateUtil';
import { Evento } from 'src/app/model/Evento';
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
  duracionTipoEvento : Time = new Time("00","00")
  hastaElOtroDiaCheckbox : boolean = false

  // Cotizacion
  listaExtra : Array<GenericItem> = []
  listaExtraVariable : Array<GenericItem> = []
  precioTipoEvento : number = 0

  // Catering
  listaExtraTipoCatering : Array<GenericItem> = []
  listaExtraCateringVariable : Array<GenericItem> = []
  agregarCatering : boolean = false
  cateringOtro : boolean = false

  // Datos del contacto
  listaSexo : Array<string> = []

  // Errors
  errors = []
  error : ErrorMensaje = new ErrorMensaje(false, '')
  usuarioCondicional : boolean = false

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
    this.cleanEvento()

    // Datos del evento
    this.duracionTipoEvento = await this.tipoEventoService.getDuracionByTipoEventoId(this.evento.tipoEventoId)
    this.changeTime()
    this.changeDate()
    // Tipo de evento
    this.listaServicio = await this.servicioSerice.getAllServicioByTipoEventoId(this.evento.tipoEventoId)

    // Cotizacion
    this.listaExtra = await this.extraService.getAllExtraEventoByTipoEventoId(this.evento.tipoEventoId)
    this.listaExtraVariable = await this.extraService.getAllExtraEventoVariableByTipoEventoId(this.evento.tipoEventoId)

    // Catering
    this.listaExtraTipoCatering = await this.extraService.getAllTipoCateringByTipoEventoId(this.evento.tipoEventoId)
    this.listaExtraCateringVariable = await this.extraService.getAllCateringExtraByTipoEventoId(this.evento.tipoEventoId)
  
  }

  async changeDate(){
    this.precioTipoEvento = await this.tipoEventoService.getPrecioByTipoEventoIdAndFecha(this.evento.tipoEventoId, this.fechaEvento)
    console.log(this.precioTipoEvento)
  }

  async changeTime(){
    this.finalTime = await this.tipoEventoService.getTimeEndByTipoEventoIdAndTimeStart(this.evento.tipoEventoId, this.inicioTime)
    this.hastaElOtroDiaCheckbox = Number(this.finalTime.hour) < Number(this.inicioTime.hour)
  }

  cleanEvento(){
    this.evento = new Evento(0,this.evento.nombre, "", this.evento.inicio, this.evento.fin, this.evento.tipoEventoId, 
    this.evento.capacidad, 0, new Agregados(0,0,0,[],[]), new CateringEvento(0,0,0,"",[],[]), this.evento.cliente, 0)
  }

  sumPresupuesto(){
    this.evento.presupuesto = this.precioTipoEvento
  }

  getAllDaysOfMonth(year : number, mes: number){
    this.listaDia = DateUtil.getAllDaysOfMonth(year, mes)
  }

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
