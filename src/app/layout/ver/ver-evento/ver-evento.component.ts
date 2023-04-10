import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Capacidad } from 'src/app/model/Capacidad';
import { EventoVer } from 'src/app/model/Evento';
import { Extra } from 'src/app/model/Extra';
import { ExtraVariable } from 'src/app/model/ExtraVariable';
import { GenericItem } from 'src/app/model/GenericItem';
import { Time } from 'src/app/model/Time';
import { Cliente } from 'src/app/model/Usuario';
import { EmpresaService } from 'src/app/services/empresa.service';
import { EventoService } from 'src/app/services/evento.service';
import { ErrorMensaje, getErrorConMensaje } from 'src/util/errorHandler';

@Component({
  selector: 'app-edit-evento',
  templateUrl: './ver-evento.component.html',
})
export class VerEventoComponent implements OnInit {

  evento : EventoVer = new EventoVer(0,"", "","","", "",new Capacidad(0,0,0),0,
  0,[],[],"",[],[], new Cliente(0,"","","","",0),0,"","", "")

  inicio : Time = new Time("0","0")
  fin : Time = new Time("0","0")

  extras : boolean = false
  extrasVariables : boolean = false
  extraCatering : boolean = false
  tipoCatering : boolean = false

  eventoReenviarMail : boolean = false
  eventoErrorReenviarMail = new ErrorMensaje(false, '')
  errors = []

  modalEditar = false
  tituloModalEditar="Editar anotaciones"

  modalListar = false
  tituloModalListar="Lista de extras"
  listaModal : Array<GenericItem> = []

  constructor(private eventoService : EventoService, private empresaService : EmpresaService, private router : Router) { }

  async ngOnInit() {
    this.evento = await this.eventoService.getEventoVer()

    this.evento.empresa = (await this.empresaService.getEmpresa()).nombre

    this.inicio.hour = this.evento.inicio.split(":")[0].split("T")[1]
    this.inicio.minute = this.evento.inicio.split(":")[1]

    this.fin.hour = this.evento.fin.split(":")[0].split("T")[1]
    this.fin.minute = this.evento.fin.split(":")[1]

    this.extras = this.evento.listaExtra.length > 0
    this.extrasVariables = this.evento.listaExtraVariable.length > 0
    this.extraCatering = this.evento.listaExtraCateringVariable.length > 0
    this.tipoCatering = this.evento.listaExtraTipoCatering.length > 0

  }

  verCliente(){
    console.log("TODO")
  }

  editAnotacionesModal(){
    this.setModalEditar(!this.modalEditar)
  }

  setListaModal(lista : Array<GenericItem>){
    this.listaModal = lista
    this.setModalListar(!this.modalListar)
  }

  async editAnotaciones(anotacion : string){
    this.evento.anotaciones = anotacion
    await this.eventoService.editEventoAnotaciones(anotacion, this.evento.id)
  }

  setModalEditar(modal : boolean){
    this.modalEditar = modal
  }

  setModalListar(modal : boolean){
    this.modalListar = modal
  }

  listaExtraVariableToModal(lista : Array<ExtraVariable>){
    return lista.map((extraVariable: ExtraVariable) => new GenericItem(extraVariable.id, extraVariable.nombre))
  }

  volver(){
    this.router.navigateByUrl("/abmEvento")
  }

  descargarComprobante(){
    console.log("TODO")
  }

  async reenviarMail(){
    try{
      this.eventoReenviarMail = await this.eventoService.reenviarMail(this.evento.id)
      this.eventoErrorReenviarMail.condicional = false
    }catch(error: any){
      this.eventoErrorReenviarMail.condicional = true
      this.eventoReenviarMail = false
      this.eventoErrorReenviarMail.mensaje = getErrorConMensaje(error)
    }
  }

}
