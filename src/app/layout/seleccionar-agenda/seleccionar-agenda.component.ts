import { Component, OnInit } from '@angular/core';
import { AgendaCard } from 'src/app/model/Agenda';
import { AgendaService } from 'src/app/services/agenda.service';
import { LoginService } from 'src/app/services/login.service';
import { mostrarErrorConMensaje } from 'src/util/errorHandler';

@Component({
  selector: 'app-seleccionar-agenda',
  templateUrl: './seleccionar-agenda.component.html',
  styleUrls: ['./seleccionar-agenda.component.css']
})
export class SeleccionarAgendaComponent implements OnInit {

  listaAgenda: Array<AgendaCard> = []

  constructor(public agendaService : AgendaService, public logInService : LoginService) { }

  async ngOnInit(): Promise<void> {
    try {
      this.listaAgenda = await this.agendaService.getListaAgendaByUsuarioId(this.logInService.getIdUsuarioLogueado()!)
    } catch (error) {
      mostrarErrorConMensaje(this, error)
    }
  }

}
