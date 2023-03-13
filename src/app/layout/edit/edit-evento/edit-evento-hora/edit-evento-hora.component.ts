import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DateUtil } from 'src/app/model/DateUtil';
import { EventoHora } from 'src/app/model/Evento';
import { Time } from 'src/app/model/Time';
import { EventoService } from 'src/app/services/evento.service';

@Component({
  selector: 'app-edit-evento-hora',
  templateUrl: './edit-evento-hora.component.html',
  styleUrls: ['./edit-evento-hora.component.css']
})
export class EditEventoHoraComponent implements OnInit {

  evento : EventoHora = new EventoHora(0,"","","","")
  listaHora : Array<string> = DateUtil.ListaHora
  listaMinuto : Array<string> = DateUtil.ListaMinuto
  inicio : Time = new Time("00","00")
  fin : Time = new Time("00","00")

  constructor(private eventoService : EventoService, private router : Router) { }

  async ngOnInit() {
    this.evento = await this.eventoService.getEventoHora()
  }

  volver(){
    this.router.navigateByUrl("/abmEvento")
  }

}
