import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { REST_SERVER_URL } from 'src/util/configuration';
import { GenericItem, GenericItemJSON} from '../model/GenericItem';
import { TipoEvento, TipoEventoEditJSON, TipoEventoJSON } from '../model/TipoEvento';
import { AgendaService } from './agenda.service';

@Injectable({
  providedIn: 'root'
})
export class TipoEventoService {
  
  tipoEventoId : number = 0
  
  constructor(private httpClient: HttpClient, private agendaService : AgendaService) {}
  
  async getTipoEvento(id : number) {
    const item$ = this.httpClient.get<TipoEventoEditJSON>(REST_SERVER_URL + '/getTipoEvento/' + id)
    const item = await lastValueFrom(item$)
    return TipoEvento.fromJson(item)
  }

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
    tipoEvento.empresaId = this.agendaService.getEmpresaId()
    console.log(tipoEvento)
    const item$ = this.httpClient.post<GenericItem>(REST_SERVER_URL + '/saveTipoEvento', tipoEvento.toJSON())
    return await lastValueFrom(item$)
  }

  async delete(id : number) {
    return this.httpClient.delete<GenericItem>(REST_SERVER_URL + '/deleteTipoEvento/' + id)
  }


}
