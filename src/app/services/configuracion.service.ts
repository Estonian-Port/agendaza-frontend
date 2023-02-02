import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { REST_SERVER_URL } from 'src/util/configuration';
import { Configuracion, ConfiguracionJSON } from '../model/Configuracion';
import { Usuario, UsuarioJSON } from '../model/Usuario';
import { AgendaService } from './agenda.service';

@Injectable({
  providedIn: 'root'
})
export class ConfiguracionService {

  constructor(private httpClient: HttpClient, private agendaService : AgendaService) { }

  async getAllCantidadesConfiguracionByEmpresaId() : Promise<Configuracion> {
    const configuracion$ = this.httpClient.get<ConfiguracionJSON>(REST_SERVER_URL + '/getAllCantidadesConfiguracionByEmpresa/' + this.agendaService.getAgendaId())
    return Configuracion.fromJson(await lastValueFrom(configuracion$))
  }

  async getAllEmpleadosByEmpresaId() {
    const listaUsuario$ = this.httpClient.get<UsuarioJSON[]>(REST_SERVER_URL + '/getAllEmpleadosByEmpresaId/' + this.agendaService.getAgendaId())
    const listaUsuario = await lastValueFrom(listaUsuario$)
    return listaUsuario.map((usuario) => Usuario.fromJson(usuario))
  }
}
