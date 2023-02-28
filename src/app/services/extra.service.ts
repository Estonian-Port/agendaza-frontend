import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { REST_SERVER_URL } from 'src/util/configuration';
import { Extra, ExtraJSON } from '../model/Extra';
import { GenericItem } from '../model/GenericItem';
import { Precio, PrecioForm, PrecioJSON } from '../model/Precio';
import { AgendaService } from './agenda.service';

@Injectable({
  providedIn: 'root'
})
export class ExtraService {


  extraId : number = 0
  extraVolver: string = "";

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

  async getAllPrecioConFechaByExtraId(extraId: number) {
    const listaItem$ = this.httpClient.get<PrecioJSON[]>(REST_SERVER_URL + '/getAllPrecioConFechaByExtraId/' + extraId)
    const listaItem = await lastValueFrom(listaItem$)
    return listaItem.map((precio) => Precio.toForm(Precio.fromJson(precio)))
  }

  async savePrecio(listaPrecioForm : PrecioForm[]) {
    const listaPrecio = listaPrecioForm.map((precio) => Precio.fromForm(precio, this.agendaService.getEmpresaId(), this.extraId))
    const item$ = this.httpClient.post<GenericItem>(REST_SERVER_URL + '/saveExtraPrecio', listaPrecio)
    this.extraId = 0
    return await lastValueFrom(item$)
  }

  async getAllExtraEventoByTipoEventoId(id : number) {
    const listaItem$ = this.httpClient.get<GenericItem[]>(REST_SERVER_URL + '/getAllExtraEventoByTipoEventoId/' + id)
    return await lastValueFrom(listaItem$)
  }

  async getAllExtraEventoVariableByTipoEventoId(id : number) {
    const listaItem$ = this.httpClient.get<GenericItem[]>(REST_SERVER_URL + '/getAllExtraEventoVariableByTipoEventoId/' + id)
    return await lastValueFrom(listaItem$)
  }

  async getAllTipoCateringByTipoEventoId(id : number) {
    const listaItem$ = this.httpClient.get<GenericItem[]>(REST_SERVER_URL + '/getAllTipoCateringByTipoEventoId/' + id)
    return await lastValueFrom(listaItem$)
  }

  async getAllCateringExtraByTipoEventoId(id : number) {
    const listaItem$ = this.httpClient.get<GenericItem[]>(REST_SERVER_URL + '/getAllCateringExtraByTipoEventoId/' + id)
    return await lastValueFrom(listaItem$)
  }

}
