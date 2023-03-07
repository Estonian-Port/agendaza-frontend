import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { REST_SERVER_URL } from 'src/util/configuration';
import { Evento, EventoJSON } from '../model/Evento';
import { Cliente, Usuario, UsuarioJSON } from '../model/Usuario';
import { AgendaService } from './agenda.service';

@Injectable({
  providedIn: 'root'
})
export class EventoService {

  constructor(private httpClient : HttpClient, private agendaService : AgendaService) { }

  async getAllEventoByEmpresaId() {
    const listaItem$ = this.httpClient.get<EventoJSON[]>(REST_SERVER_URL + '/getAllEventoByEmpresaId/' + this.agendaService.getEmpresaId())
    const listaItem = await lastValueFrom(listaItem$)
    return listaItem.map((evento) => Evento.fromJson(evento))
  }

  async buscarClientePorDni(dni : number){
    const usuario$ = this.httpClient.put<Cliente>(REST_SERVER_URL + '/getUsuarioByDni', dni)
    return await lastValueFrom(usuario$)
  }

  async buscarClientePorEmail(email : string){
    const usuario$ = this.httpClient.put<Cliente>(REST_SERVER_URL + '/getUsuarioByEmail', email)
    return await lastValueFrom(usuario$)
  }

  async buscarClientePorCelular(celular : number){
    const usuario$ = this.httpClient.put<Cliente>(REST_SERVER_URL + '/getUsuarioByCelular', celular)
    return await lastValueFrom(usuario$)
  }

  async save(evento: Evento) {
    evento.empresaId = this.agendaService.getEmpresaId()
    const item$ = this.httpClient.post<Evento>(REST_SERVER_URL + '/saveEvento', evento)
    return await lastValueFrom(item$)
  }

  async getAllEstado() {
    const listaItem$ = this.httpClient.get<string[]>(REST_SERVER_URL + '/getAllEstado')
    return await lastValueFrom(listaItem$)
  }
}
