import { Component, OnInit } from '@angular/core';
import { co } from '@fullcalendar/core/internal-common';
import { Capacidad } from 'src/app/model/Capacidad';
import { DateUtil, Mes } from 'src/app/model/DateUtil';
import { Evento } from 'src/app/model/Evento';
import { FechaForm } from 'src/app/model/FechaForm';
import { GenericItem } from 'src/app/model/GenericItem';
import { AgendaService } from 'src/app/services/agenda.service';
import { EmpresaService } from 'src/app/services/empresa.service';
import { ServicioService } from 'src/app/services/servicio.service';
import { TipoEventoService } from 'src/app/services/tipo-evento.service';


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

  evento : Evento = new Evento(0,"","", new Date(), new Date(), 0, new Capacidad(0,0,0), 0)

  // Tipo de evento
  listaDuracion : Array<string> = []
  listaTipoEvento : Array<GenericItem> = []
  listaServicio : Array<GenericItem> = []

  // Datos del evento
  empresa : GenericItem = new GenericItem(0,"")
  listaDia : Array<number> = []
  listaMes : Array<Mes> = DateUtil.ListaMes
  currentYear = new Date().getFullYear()
  listaYear : Array<number> = [this.currentYear, this.currentYear + 1]
  fechaEvento : FechaForm = new FechaForm(this.currentYear,0,1)
  listaHora : Array<number> = DateUtil.ListaHora
  listaMinuto : Array<number> = DateUtil.ListaMinuto


  constructor(public tipoEventoService : TipoEventoService, public servicioSerice : ServicioService, public empresaService : EmpresaService) { }

  async ngOnInit(): Promise<void> {
    this.listaDuracion = await this.tipoEventoService.getAllDuracion()
    this.listaTipoEvento = await this.tipoEventoService.getAllTipoEventoByEmpresaId()
    this.listaServicio = await this.servicioSerice.getAllServicioByEmpresaId()
    this.empresa = await this.empresaService.getEmpresa()

    this.listaDia = DateUtil.getAllDaysOfMonth(this.currentYear, 0)
    
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
