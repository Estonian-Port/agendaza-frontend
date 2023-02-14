import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { REST_SERVER_URL } from 'src/util/configuration';
import { GenericItem, GenericItemJSON} from '../model/GenericItem';
import { GenericItemEmpresa } from '../model/GenericItemEmpresa';
import { AgendaService } from './agenda.service';

@Injectable({
  providedIn: 'root'
})
export class TipoEventoService {
  
  constructor(private httpClient: HttpClient, private agendaService : AgendaService) {}
  
  async getAllTipoEventoByEmpresaId() {
    const listaItem$ = this.httpClient.get<GenericItemJSON[]>(REST_SERVER_URL + '/getAllTipoEventoByEmpresaId/' + this.agendaService.getEmpresaId())
    const listaItem = await lastValueFrom(listaItem$)
    return listaItem.map((tipoEvento) => GenericItem.fromJson(tipoEvento))
  }

  async saveTipoEvento(genericItem : GenericItem) {
    const genericItemEmpresa = new GenericItemEmpresa(genericItem.id, genericItem.nombre, this.agendaService.getEmpresaId())
    const item$ = this.httpClient.post<GenericItem>(REST_SERVER_URL + '/saveTipoEvento', genericItemEmpresa)
    const item = await lastValueFrom(item$)
    return item
  }
}
