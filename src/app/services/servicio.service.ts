import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { REST_SERVER_URL } from 'src/util/configuration';
import { GenericItem, GenericItemJSON } from '../model/GenericItem';
import { GenericItemEmpresa } from '../model/GenericItemEmpresa';
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

  async saveServicio(genericItem : GenericItem) {
    const genericItemEmpresa = new GenericItemEmpresa(this.agendaService.getEmpresaId(), genericItem)
    const listaItem$ = this.httpClient.post<GenericItem>(REST_SERVER_URL + '/saveServicio', genericItemEmpresa)
    const listaItem = await lastValueFrom(listaItem$)

    return ""
  }

}
