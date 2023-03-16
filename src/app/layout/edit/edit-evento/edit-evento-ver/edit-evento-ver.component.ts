import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Agregados } from 'src/app/model/Agregados';
import { Capacidad } from 'src/app/model/Capacidad';
import { CateringEvento } from 'src/app/model/CateringEvento';
import { EventoVer } from 'src/app/model/Evento';
import { Time } from 'src/app/model/Time';
import { Cliente } from 'src/app/model/Usuario';
import { EmpresaService } from 'src/app/services/empresa.service';
import { EventoService } from 'src/app/services/evento.service';

@Component({
  selector: 'app-edit-evento-ver',
  templateUrl: './edit-evento-ver.component.html',
  styleUrls: ['./edit-evento-ver.component.css']
})
export class EditEventoVerComponent implements OnInit {

  evento : EventoVer = new EventoVer(0,"", "","","", "",new Capacidad(0,0,0), 
    new Agregados(0,0,0,[],[]),new CateringEvento(0,0,0,"",[],[]), new Cliente(0,"","","","",0),0,"","")

  inicio : Time = new Time("0","0")
  fin : Time = new Time("0","0")

  extras : boolean = false
  extrasVariables : boolean = false
  extraCatering : boolean = false
  tipoCatering : boolean = false

  constructor(private eventoService : EventoService, private empresaService : EmpresaService, private router : Router) { }

  async ngOnInit() {
    this.evento = await this.eventoService.getEventoVer()

    this.evento.empresa = (await this.empresaService.getEmpresa()).nombre

    this.inicio.hour = this.evento.inicio.split(":")[0].split("T")[1]
    this.inicio.minute = this.evento.inicio.split(":")[1]

    this.fin.hour = this.evento.fin.split(":")[0].split("T")[1]
    this.fin.minute = this.evento.fin.split(":")[1]

    this.extras = this.evento.agregados.listaExtra.length > 0
    this.extrasVariables = this.evento.agregados.listaExtraVariable.length > 0
    this.extraCatering = this.evento.catering.listaExtraCateringVariable.length > 0
    this.tipoCatering = this.evento.catering.listaExtraTipoCatering.length > 0

  }

  verCliente(){
    console.log("TODO")
  }

  volver(){
    this.router.navigateByUrl("/abmEvento")
  }

  descargarComprobante(){
    console.log("TODO")
  }

  reenviarMail(){
    console.log("TODO")
  }


}
