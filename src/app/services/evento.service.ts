import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { REST_SERVER_URL } from 'src/util/configuration';
import { Evento, EventoJSON } from '../model/Evento';
import { AgendaService } from './agenda.service';

@Injectable({
  providedIn: 'root'
})
export class EventoService {

  constructor(private httpClient : HttpClient, private agendaService : AgendaService) { }

  async getAllEventoByEmpresaId() {
    const listaItem$ = this.httpClient.get<EventoJSON[]>(REST_SERVER_URL + '/getAllEventoByEmpresaId/' + this.agendaService.getAgendaId())
    const listaItem = await lastValueFrom(listaItem$)
    return listaItem.map((evento) => Evento.fromJson(evento))
  }
}
