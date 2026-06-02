import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { REST_SERVER_URL } from 'src/util/configuration';
import { Empresa, EmpresaAbm, EmpresaAbmJSON } from '../model/Empresa';
import { GenericItem } from '../model/GenericItem';
import { Especificacion, EspecificacionJSON } from '../model/Especificacion';
import { CustomResponse } from 'src/util/customResponse';
import { PanelAdmin } from '../model/Configuracion';
import { TipoEventoJSON } from '../model/TipoEvento';

@Injectable({
  providedIn: 'root'
})
export class EmpresaService {

  constructor(private httpClient: HttpClient) {}

  async getEmpresa(empresaId: number): Promise<GenericItem> {
    const item$ = this.httpClient.get<CustomResponse<GenericItem>>(
      REST_SERVER_URL + '/v1/empresas/' + empresaId
    );
    const response = await lastValueFrom(item$);
    return response.data;
  }

  async getEmpresaAbm(empresaId: number): Promise<EmpresaAbm> {
    const item$ = this.httpClient.get<CustomResponse<EmpresaAbm>>(
      REST_SERVER_URL + '/v1/empresas/' + empresaId + '/abm'
    );
    const response = await lastValueFrom(item$);
    return response.data;
  }

  async getAllEmpresaByUsuarioId(usuarioId: number): Promise<EmpresaAbm[]> {
    // TODO Según el controlador del paso anterior, este endpoint 
    // le pertenece a UsuarioController, no a EmpresaController.
    const listaItem$ = this.httpClient.get<CustomResponse<EmpresaAbmJSON[]>>(
      REST_SERVER_URL + '/v1/usuarios/' + usuarioId + '/empresas'
    );
    const response = await lastValueFrom(listaItem$);
    return response.data.map((empresa) => EmpresaAbm.fromJson(empresa));
  }

  async save(empresa: Empresa): Promise<GenericItem> {
    // Para POST y PUT, la convención REST es usar la ruta base de la entidad
    const item$ = this.httpClient.post<CustomResponse<GenericItem>>(
      REST_SERVER_URL + '/v1/empresas', 
      empresa
    );
    const response = await lastValueFrom(item$);
    return response.data;
  }

  async getEspecificaciones(empresaId: number): Promise<Especificacion[]> {
    const listaItem$ = this.httpClient.get<CustomResponse<EspecificacionJSON[]>>(
      REST_SERVER_URL + '/v1/empresas/' + empresaId + '/especificaciones'
    );
    const response = await lastValueFrom(listaItem$);
    return response.data.map((especificacion) => Especificacion.fromJson(especificacion));
  }

  async getAllCantidadesForPanelAdminByEmpresaId(empresaId: number): Promise<PanelAdmin> {
    const configuracion$ = this.httpClient.get<CustomResponse<PanelAdmin>>(
      REST_SERVER_URL + '/v1/empresas/' + empresaId + '/panel-admin/cantidades'
    );
    const response = await lastValueFrom(configuracion$);
    return response.data;
  }

  async getAllTipoEventoByEmpresaIdAndDuracion(empresaId: number, duracion: string) {
    const url = `${REST_SERVER_URL}/v1/empresas/${empresaId}/tipos-evento?duracion=${duracion}`;
    const listaItem$ = this.httpClient.get<CustomResponse<TipoEventoJSON[]>>(url);
    const response = await lastValueFrom(listaItem$);
        return response.data.map((tipoEvento) => GenericItem.fromJson(tipoEvento));
  }
}