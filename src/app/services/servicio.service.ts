import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { REST_SERVER_URL } from 'src/util/configuration';
import { GenericItem, GenericItemJSON } from '../model/GenericItem';
import { GenericItemEmpresa } from '../model/GenericItemEmpresa';
import { GenericItemEmpresaTipoEvento } from '../model/GenericItemEmpresaTipoEvento';
import { AgendaService } from './agenda.service';

@Injectable({
  providedIn: 'root'
})
export class ServicioService {

  constructor(private httpClient: HttpClient, private agendaService : AgendaService) {}

  async getAllServicioByEmpresaId() {
    const listaItem$ = this.httpClient.get<GenericItemJSON[]>(REST_SERVER_URL + '/getAllServicioByEmpresaId/' + this.agendaService.getEmpresaId())
    const listaItem = await lastValueFrom(listaItem$)
    return listaItem.map((servicio) => GenericItem.fromJson(servicio))
  }

  async saveServicio(genericItem : GenericItemEmpresaTipoEvento) {
    const genericItemEmpresaTipoEvento = new GenericItemEmpresaTipoEvento(genericItem.id, genericItem.nombre, this.agendaService.getEmpresaId(), genericItem.listaTipoEventoId)
    const item$ = this.httpClient.post<GenericItem>(REST_SERVER_URL + '/saveServicio', genericItemEmpresaTipoEvento)
    const item = await lastValueFrom(item$)
    return item
  }

}
