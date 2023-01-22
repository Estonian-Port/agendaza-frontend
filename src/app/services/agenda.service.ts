import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { lastValueFrom } from 'rxjs'
import { REST_SERVER_URL } from 'src/util/configuration'
import { AgendaCard, AgendaCardJSON } from '../model/Agenda'


@Injectable({
  providedIn: 'root'
})
export class AgendaService {

  constructor(private httpClient: HttpClient) {}


  async getListaAgendaByUsuarioId(idUsuario : number) {
    const listaAgenda$ = this.httpClient.get<AgendaCardJSON[]>(REST_SERVER_URL + '/getListaAgendaByUsuarioId/' + idUsuario)
    const listaAgenda = await lastValueFrom(listaAgenda$)

    return listaAgenda.map((agendaCard) => AgendaCard.fromJson(agendaCard))
  }

}
