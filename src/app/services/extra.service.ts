import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { REST_SERVER_URL } from 'src/util/configuration';
import { Extra, ExtraJSON } from '../model/Extra';
import { ExtraVariable } from '../model/ExtraVariable';
import { FechaForm } from '../model/FechaForm';
import { GenericItem, GenericItemEmpresaTipoEvento } from '../model/GenericItem';
import { Precio, PrecioForm, PrecioJSON } from '../model/Precio';
import { AgendaService } from './agenda.service';

@Injectable({
  providedIn: 'root'
})
export class ExtraService {

  extraId : number = 0
  extraVolver: string = ""
  cantidadExtras : number = 0

  constructor(private httpClient: HttpClient, private agendaService : AgendaService) { }

  async getExtra(id : number) {
    const item$ = this.httpClient.get<ExtraJSON>(REST_SERVER_URL + '/getExtra/' + id)
    const item = await lastValueFrom(item$)
    return Extra.fromJson(item)
  }

  async getAllExtraByEmpresaId(pageNumber : number) {
    const listaItem$ = this.httpClient.get<ExtraJSON[]>(REST_SERVER_URL + '/getAllExtra/' + this.agendaService.getEmpresaId() + '/' + pageNumber)
    const listaItem = await lastValueFrom(listaItem$)
    return listaItem.map((extra) => Extra.fromJson(extra))
  }

  async getAllExtraByFilterName(pageNumber : number, buscar : string) {
    const listaItem$ = this.httpClient.get<ExtraJSON[]>(REST_SERVER_URL + '/getAllExtraFilter/' + this.agendaService.getEmpresaId() + '/' + pageNumber + '/' + buscar)
    const listaItem = await lastValueFrom(listaItem$)
    return listaItem.map((extra) => Extra.fromJson(extra))
  }

  async cantExtras(){
    const cant$ = this.httpClient.get<number>(REST_SERVER_URL + '/cantExtras/' + this.agendaService.getEmpresaId())
    this.cantidadExtras = await lastValueFrom(cant$)
    return this.cantidadExtras
  }

  async cantExtrasFiltrados(buscar : string){
    const cant$ = this.httpClient.get<number>(REST_SERVER_URL + '/cantExtrasFiltrados/' + this.agendaService.getEmpresaId() + '/' + buscar)
    this.cantidadExtras = await lastValueFrom(cant$)
    return this.cantidadExtras
  }

  async getAllExtraCateringByEmpresaId(pageNumber : number) {
    const listaItem$ = this.httpClient.get<ExtraJSON[]>(REST_SERVER_URL + '/getAllExtraCatering/' + this.agendaService.getEmpresaId() + '/' + pageNumber)
    const listaItem = await lastValueFrom(listaItem$)
    return listaItem.map((extra) => Extra.fromJson(extra))
  }

  async getAllExtraCateringFilter(pageNumber : number, buscar : string) {
    const listaItem$ = this.httpClient.get<ExtraJSON[]>(REST_SERVER_URL + '/getAllExtraCateringFilter/' + this.agendaService.getEmpresaId() + '/' + pageNumber + '/' + buscar)
    const listaItem = await lastValueFrom(listaItem$)
    return listaItem.map((extra) => Extra.fromJson(extra))
  }

  async cantExtraCatering(){
    const cant$ = this.httpClient.get<number>(REST_SERVER_URL + '/cantExtraCatering/' + this.agendaService.getEmpresaId())
    this.cantidadExtras = await lastValueFrom(cant$)
    return this.cantidadExtras
  }

  async cantExtraCateringFilter(buscar : string){
    const cant$ = this.httpClient.get<number>(REST_SERVER_URL + '/cantExtraCateringFilter/' + this.agendaService.getEmpresaId() + '/' + buscar)
    this.cantidadExtras = await lastValueFrom(cant$)
    return this.cantidadExtras
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
    const item$ = this.httpClient.post<Extra>(REST_SERVER_URL + '/saveExtra', extra)
    return await lastValueFrom(item$)
  }

  delete(id: number) {
    return this.httpClient.delete<GenericItem>(REST_SERVER_URL + '/deleteExtra/' + id + "/" + this.agendaService.getEmpresaId())
  }

  async getAllPrecioConFechaByExtraId(extraId: number) {
    const listaItem$ = this.httpClient.get<PrecioJSON[]>(REST_SERVER_URL + '/getAllPrecioConFechaByExtraId/' + this.agendaService.getEmpresaId() + '/' + extraId)
    const listaItem = await lastValueFrom(listaItem$)
    return listaItem.map((precio) => Precio.toForm(Precio.fromJson(precio)))
  }

  async savePrecio(listaPrecioForm : PrecioForm[]) {
    const listaPrecio = listaPrecioForm.map((precio) => Precio.fromForm(precio, this.agendaService.getEmpresaId(), this.extraId))
    const item$ = this.httpClient.post<GenericItem>(REST_SERVER_URL + '/saveExtraPrecio/' + this.agendaService.getEmpresaId() + '/' + this.extraId, listaPrecio)
    this.extraId = 0
    return await lastValueFrom(item$)
  }

  // TODO Reemplazar fechaForm en getAllTipo...
  async getAllExtraEventoByTipoEventoIdAndFecha(id : number, fechaInicio : FechaForm) {
    const listaItem$ = this.httpClient.put<Extra[]>(REST_SERVER_URL + '/getAllExtraEventoByTipoEventoIdAndFecha/' + this.agendaService.getEmpresaId() + '/' + id, new Date(fechaInicio.year, fechaInicio.mes, fechaInicio.dia))
    return await lastValueFrom(listaItem$)
  }

  async getAllExtraEventoVariableByTipoEventoIdAndFecha(id : number, fechaInicio : FechaForm) {
    const listaItem$ = this.httpClient.put<ExtraVariable[]>(REST_SERVER_URL + '/getAllExtraEventoVariableByTipoEventoIdAndFecha/' + this.agendaService.getEmpresaId() + '/' + + id, new Date(fechaInicio.year, fechaInicio.mes, fechaInicio.dia))
    return await lastValueFrom(listaItem$)
  }

  // TODO Reemplazar fechaForm en getAllTipo...
  async getAllTipoCateringByTipoEventoIdAndFecha(id : number, fechaInicio : FechaForm) {
    const listaItem$ = this.httpClient.put<Extra[]>(REST_SERVER_URL + '/getAllTipoCateringByTipoEventoIdAndFecha/' + this.agendaService.getEmpresaId() + '/' + id, new Date(fechaInicio.year, fechaInicio.mes, fechaInicio.dia))
    return await lastValueFrom(listaItem$)
  }

  async getAllCateringExtraByTipoEventoIdAndFecha(id : number, fechaInicio : FechaForm) {
    const listaItem$ = this.httpClient.put<ExtraVariable[]>(REST_SERVER_URL + '/getAllCateringExtraByTipoEventoIdAndFecha/' + this.agendaService.getEmpresaId() + '/' + + id, new Date(fechaInicio.year, fechaInicio.mes, fechaInicio.dia))
    return await lastValueFrom(listaItem$)
  }

  async getAllExtraEventoAgregar() {
    const listaItem$ = this.httpClient.get<Extra[]>(REST_SERVER_URL + '/getAllExtraEventoAgregar/' + this.agendaService.getEmpresaId())
    const listaItem = await lastValueFrom(listaItem$)
    return listaItem.map((extra) => GenericItem.fromJson(extra))
  }

  async getAllExtraCateringAgregar() {
    const listaItem$ = this.httpClient.get<Extra[]>(REST_SERVER_URL + '/getAllExtraCateringAgregar/' + this.agendaService.getEmpresaId())
    const listaItem = await lastValueFrom(listaItem$)
    return listaItem.map((extra) => GenericItem.fromJson(extra))
  }

}
