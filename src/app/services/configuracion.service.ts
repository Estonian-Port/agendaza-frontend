import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { REST_SERVER_URL } from 'src/util/configuration';
import { Configuracion, ConfiguracionJSON } from '../model/Configuracion';
import { AgendaService } from './agenda.service';

@Injectable({
  providedIn: 'root'
})
export class ConfiguracionService {

  constructor(private httpClient: HttpClient, private agendaService : AgendaService) { }

  async getAllCantidadesConfiguracionByEmpresaId() : Promise<Configuracion> {
    const configuracion$ = this.httpClient.get<ConfiguracionJSON>(REST_SERVER_URL + '/getAllCantidadesConfiguracionByEmpresa/' + this.agendaService.getEmpresaId())
    return Configuracion.fromJson(await lastValueFrom(configuracion$))
  }

}
