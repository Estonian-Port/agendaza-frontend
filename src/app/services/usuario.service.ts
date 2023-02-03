import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { REST_SERVER_URL } from 'src/util/configuration';
import { Usuario, UsuarioJSON } from '../model/Usuario';
import { AgendaService } from './agenda.service';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  constructor(private httpClient: HttpClient, private agendaService : AgendaService) { }

  async getAllUsuariosByEmpresaId() {
    const listaItem$ = this.httpClient.get<UsuarioJSON[]>(REST_SERVER_URL + '/getAllUsuariosByEmpresaId/' + this.agendaService.getAgendaId())
    const listaItem = await lastValueFrom(listaItem$)
    return listaItem.map((usuario) => Usuario.fromJson(usuario))
  }
}
