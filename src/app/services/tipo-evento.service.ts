import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { REST_SERVER_URL } from 'src/util/configuration';
import { GenericItem, GenericItemJSON} from '../model/GenericItem';
import { GenericItemEmpresa } from '../model/GenericItemEmpresa';
import { TipoEvento } from '../model/TipoEvento';
import { AgendaService } from './agenda.service';

@Injectable({
  providedIn: 'root'
})
export class TipoEventoService {
  
  tipoEventoId : number = 0
  
  constructor(private httpClient: HttpClient, private agendaService : AgendaService) {}
  
  async getAllTipoEventoByEmpresaId() {
    const listaItem$ = this.httpClient.get<GenericItemJSON[]>(REST_SERVER_URL + '/getAllTipoEventoByEmpresaId/' + this.agendaService.getEmpresaId())
    const listaItem = await lastValueFrom(listaItem$)
    return listaItem.map((tipoEvento) => GenericItem.fromJson(tipoEvento))
  }

  async getAllDuracion() {
    const listaItem$ = this.httpClient.get<string[]>(REST_SERVER_URL + '/getAllDuracion')
    return await lastValueFrom(listaItem$)
  }

  async save(tipoEvento : TipoEvento) {
    const item$ = this.httpClient.post<GenericItem>(REST_SERVER_URL + '/saveServicio', tipoEvento)
    return await lastValueFrom(item$)
  }

  async delete(id : number) {
    return this.httpClient.delete<GenericItem>(REST_SERVER_URL + '/deleteServicio/' + id)
  }


}
