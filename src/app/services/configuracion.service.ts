import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { REST_SERVER_URL } from 'src/util/configuration';
import { Configuracion, ConfiguracionJSON } from '../model/Configuracion';
import { UsuarioEmpresa } from '../model/Usuario';
import { AgendaService } from './agenda.service';
import { LoginService } from './login.service';

@Injectable({
  providedIn: 'root'
})
export class ConfiguracionService {

  constructor(private httpClient: HttpClient, private agendaService : AgendaService, private loginService : LoginService) { }

  async getAllCantidadesConfiguracionByUsuarioIdAndEmpresaId() : Promise<Configuracion> {
    const usuarioEmpresa = new UsuarioEmpresa(await this.loginService.getUsuarioId(), this.agendaService.getEmpresaId())
    const configuracion$ = this.httpClient.put<ConfiguracionJSON>(REST_SERVER_URL + '/getAllCantidadesConfiguracionByUsuarioIdAndEmpresaId', usuarioEmpresa )
    return Configuracion.fromJson(await lastValueFrom(configuracion$))
  }

}
