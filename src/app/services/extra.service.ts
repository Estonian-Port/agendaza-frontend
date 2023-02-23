import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { REST_SERVER_URL } from 'src/util/configuration';
import { Extra, ExtraJSON } from '../model/Extra';
import { GenericItem } from '../model/GenericItem';
import { AgendaService } from './agenda.service';

@Injectable({
  providedIn: 'root'
})
export class ExtraService {

  extraId : number = 0

  constructor(private httpClient: HttpClient, private agendaService : AgendaService) { }

  async getExtra(id : number) {
    const item$ = this.httpClient.get<ExtraJSON>(REST_SERVER_URL + '/getExtra/' + id)
    const item = await lastValueFrom(item$)
    return Extra.fromJson(item)
  }

  async getAllExtraTipoEventoByEmpresaId() {
    const listaItem$ = this.httpClient.get<ExtraJSON[]>(REST_SERVER_URL + '/getAllExtraTipoEventoByEmpresaId/' + this.agendaService.getEmpresaId())
    const listaItem = await lastValueFrom(listaItem$)
    return listaItem.map((extra) => Extra.fromJson(extra))
  }

  async getAllExtraCateringByEmpresaId() {
    const listaItem$ = this.httpClient.get<ExtraJSON[]>(REST_SERVER_URL + '/getAllExtraCateringByEmpresaId/' + this.agendaService.getEmpresaId())
    const listaItem = await lastValueFrom(listaItem$)
    return listaItem.map((extra) => Extra.fromJson(extra))
  }

  async getAllEventoTipoExtra() {
    const listaItem$ = this.httpClient.get<string[]>(REST_SERVER_URL + '/getAllEventoTipoExtra')
    return await lastValueFrom(listaItem$)
  }

  async getAllCateringTipoExtra() {
    const listaItem$ = this.httpClient.get<string[]>(REST_SERVER_URL + '/getAllCateringTipoExtra')
    return await lastValueFrom(listaItem$)
  }

  async save(extra : Extra) {
    extra.empresaId = this.agendaService.getEmpresaId()
    console.log(extra)

    const item$ = this.httpClient.post<Extra>(REST_SERVER_URL + '/saveExtra', extra)
    return await lastValueFrom(item$)
  }

  delete(id: number) {
    return this.httpClient.delete<GenericItem>(REST_SERVER_URL + '/deleteExtra/' + id)
  }

}
