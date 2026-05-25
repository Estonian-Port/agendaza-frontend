import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { REST_SERVER_URL } from 'src/util/configuration';
import { PanelAdmin } from '../model/Configuracion';
import { UsuarioService } from './usuario.service';

@Injectable({
  providedIn: 'root'
})
export class ConfiguracionService {

  constructor(private httpClient: HttpClient, private usuarioService : UsuarioService) { }

  async getAllCantidadesForPanelAdminByEmpresaId() : Promise<PanelAdmin> {
    const configuracion$ = this.httpClient.get<PanelAdmin>(REST_SERVER_URL + '/getAllCantidadesForPanelAdminByEmpresaId/' + this.usuarioService.getEmpresaId())
    return await lastValueFrom(configuracion$)
  }

}
