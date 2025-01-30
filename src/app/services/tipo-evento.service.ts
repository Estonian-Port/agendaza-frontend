import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { REST_SERVER_URL } from 'src/util/configuration';
import { Capacidad } from '../model/Capacidad';
import { ExtraVariable } from '../model/ExtraVariable';
import { FechaForm } from '../model/FechaForm';
import { GenericItem } from '../model/GenericItem';
import { Precio, PrecioForm, PrecioJSON } from '../model/Precio';
import { Time } from '../model/Time';
import { TipoEvento, TipoEventoEditJSON, TipoEventoJSON } from '../model/TipoEvento';
import { AgendaService } from './agenda.service';

@Injectable({
  providedIn: 'root'
})
export class TipoEventoService {
  
  tipoEventoId : number = 0
  cantidadTipoEvento : number = 0
  
  constructor(private httpClient: HttpClient, private agendaService : AgendaService) {}
  
  async getTipoEvento(id : number) {
    const item$ = this.httpClient.get<TipoEventoEditJSON>(REST_SERVER_URL + '/getTipoEvento/' + id)
    const item = await lastValueFrom(item$)
    return TipoEvento.fromTipoEventoEditJson(item)
  }

  async getAllTipoEventoByEmpresaId() {
    const listaItem$ = this.httpClient.get<TipoEventoJSON[]>(REST_SERVER_URL + '/getAllTipoEvento/' + this.agendaService.getEmpresaId())
    const listaItem = await lastValueFrom(listaItem$)
    return listaItem.map((tipoEvento) => TipoEvento.fromTipoEventoJson(tipoEvento))
  }

  async getAllTipoEventoByEmpresaIdAbm(pageNumber : number) {
    const listaItem$ = this.httpClient.get<TipoEventoJSON[]>(REST_SERVER_URL + '/getAllTipoEvento/' + this.agendaService.getEmpresaId() + '/' + pageNumber)
    const listaItem = await lastValueFrom(listaItem$)
    return listaItem.map((tipoEvento) => GenericItem.fromJson(tipoEvento))
  }

  async getCantidadTipoEvento(): Promise<number | PromiseLike<number>> {
    const cant$ = this.httpClient.get<number>(REST_SERVER_URL + '/getCantidadTipoEvento/' + this.agendaService.getEmpresaId())
    this.cantidadTipoEvento = await lastValueFrom(cant$)
    return this.cantidadTipoEvento
  }

  async getAllTipoEventoFiltrados(pageNumber: number, buscar: string) {
    const listaItem$ = this.httpClient.get<TipoEventoJSON[]>(REST_SERVER_URL + '/getAllTipoEventoFiltrados/' + this.agendaService.getEmpresaId() + '/' + pageNumber + '/' + buscar)
    const listaItem = await lastValueFrom(listaItem$)
    return listaItem.map((servicio) => GenericItem.fromJson(servicio))
  }

  async cantTipoEventoFiltrados(buscar: string): Promise<number | PromiseLike<number>> {
    const cant$ = this.httpClient.get<number>(REST_SERVER_URL + '/getCantidadTipoEventoFiltrados/' + this.agendaService.getEmpresaId() + '/' + buscar)
    this.cantidadTipoEvento = await lastValueFrom(cant$)
    return this.cantidadTipoEvento
  }

  async getAllDuracion() {
    const listaItem$ = this.httpClient.get<string[]>(REST_SERVER_URL + '/getAllDuracion')
    return await lastValueFrom(listaItem$)
  }

  async save(tipoEvento : TipoEvento) {
    tipoEvento.empresaId = this.agendaService.getEmpresaId()
    const item$ = this.httpClient.post<GenericItem>(REST_SERVER_URL + '/saveTipoEvento', tipoEvento.toJSON())
    return await lastValueFrom(item$)
  }

  async delete(id : number) {
    return this.httpClient.delete<GenericItem>(REST_SERVER_URL + '/deleteTipoEvento/' + id)
  }

  async getAllPrecioConFechaByTipoEventoId(tipoEventoId: number) {
    const listaItem$ = this.httpClient.get<PrecioJSON[]>(REST_SERVER_URL + '/getAllPrecioConFechaByTipoEventoId/' + tipoEventoId)
    const listaItem = await lastValueFrom(listaItem$)
    return listaItem.map((precio) => Precio.toForm(Precio.fromJson(precio)))
  }

  async getPrecioByTipoEventoIdAndFecha(tipoEventoId: number, fechaInicio : FechaForm) {
    const precio$ = this.httpClient.put<number>(REST_SERVER_URL + '/getPrecioByTipoEventoIdAndFecha/' + tipoEventoId, new Date(fechaInicio.year, fechaInicio.mes, fechaInicio.dia))
    return await lastValueFrom(precio$)
  }

  async savePrecio(listaPrecioForm : PrecioForm[]) {
    const listaPrecio = listaPrecioForm.map((precio) => Precio.fromForm(precio, this.agendaService.getEmpresaId(), this.tipoEventoId))
    const item$ = this.httpClient.post<GenericItem>(REST_SERVER_URL + '/saveTipoEventoPrecio/' + this.tipoEventoId, listaPrecio)
    this.tipoEventoId = 0
    return await lastValueFrom(item$)
  }

  async getAllTipoEventoByEmpresaIdAndDuracion(duracion: string) {
    const listaItem$ = this.httpClient.put<TipoEventoJSON[]>(REST_SERVER_URL + '/getAllTipoEventoByEmpresaIdAndDuracion/' + this.agendaService.getEmpresaId(), duracion)
    const listaItem = await lastValueFrom(listaItem$)
    return listaItem.map((tipoEvento) => GenericItem.fromJson(tipoEvento))
  }

  async getDuracionByTipoEventoId(tipoEventoId: number) {
    const time$ = this.httpClient.get<string>(REST_SERVER_URL + '/getDuracionByTipoEventoId/' + tipoEventoId)
    const time = await lastValueFrom(time$)
    return new Time(time.substring(0,2), time.substring(3,5))
  }

  async getCapacidadByTipoEventoId(tipoEventoId: number) {
    const capacidad$ = this.httpClient.get<Capacidad>(REST_SERVER_URL + '/getCapacidadByTipoEventoId/' + tipoEventoId)
    return await lastValueFrom(capacidad$)
  }

  async getTimeEndByTipoEventoIdAndTimeStart(tipoEventoId: number, timeStart : Time) {
    const time$ = this.httpClient.put<string>(REST_SERVER_URL + '/getTimeEndByTipoEventoIdAndTimeStart/' + tipoEventoId, timeStart)
    const time = await lastValueFrom(time$)
    return new Time(time.substring(0,2), time.substring(3,5))
  }

  async findExtraNinoByTipoEventoId(tipoEventoId: number) {
    const extra$ = this.httpClient.get<ExtraVariable>(REST_SERVER_URL + '/findExtraNinoByTipoEventoId/' + tipoEventoId)
    return await lastValueFrom(extra$);
  }

  async findExtraCamareraByTipoEventoId(tipoEventoId: number) {
    const extra$ = this.httpClient.get<ExtraVariable>(REST_SERVER_URL + '/findExtraCamareraByTipoEventoId/' + tipoEventoId)
    return await lastValueFrom(extra$)
  }
}
