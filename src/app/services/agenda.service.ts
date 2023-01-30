import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { EventInput } from '@fullcalendar/core'
import { lastValueFrom } from 'rxjs'
import { REST_SERVER_URL } from 'src/util/configuration'
import { CryptoJsImpl } from 'src/util/cryptoJsImpl'
import { AgendaCard, AgendaCardJSON, AgendaEvento, AgendaEventoJSON } from '../model/Agenda'


@Injectable({
  providedIn: 'root'
})
export class AgendaService {

  constructor(private httpClient: HttpClient) {}

  async getListaAgendaByUsuarioId(usuarioId : number) {
    const listaAgenda$ = this.httpClient.get<AgendaCardJSON[]>(REST_SERVER_URL + '/getListaAgendaByUsuarioId/' + usuarioId)
    const listaAgenda = await lastValueFrom(listaAgenda$)

    return listaAgenda.map((agendaCard) => AgendaCard.fromJson(agendaCard))
  }

  async getAllEventosByEmpresaId(agendaId : number) {
    const eventos$ = this.httpClient.get<EventInput[]>(REST_SERVER_URL + '/getAllEventosByEmpresaId/' + agendaId)
    return await lastValueFrom(eventos$)
  }

  setAgendaId(agendaId : number){
    const agendaIdEncrypt = CryptoJsImpl.encryptData(agendaId)

    localStorage.setItem('agenda', agendaIdEncrypt)
  }

  getAgendaId(){
    if(localStorage.getItem('agenda') != null){
      return CryptoJsImpl.decryptData(localStorage.getItem('agenda'))
    }
    return ""
  }

  removeAgendaId(){
    localStorage.removeItem('agenda')
  }

}
