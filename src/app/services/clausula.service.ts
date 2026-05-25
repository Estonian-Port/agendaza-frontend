import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GenericItem, GenericItemJSON } from '../model/GenericItem';
import { REST_SERVER_URL } from 'src/util/configuration';
import { lastValueFrom } from 'rxjs';
import { UsuarioService } from './usuario.service';

@Injectable({
  providedIn: 'root'
})
export class ClausulaService {

  clausulaId : number = 0
  cantidadClausula : number = 0
  REST_SERVER_URL_COMPLETO = REST_SERVER_URL + '/clausula'

  constructor(private httpClient: HttpClient, private usuarioService : UsuarioService){}

  async get(id : number) {
    const item$ = this.httpClient.get<GenericItem>(this.REST_SERVER_URL_COMPLETO + '/get/' + id)
    const item = await lastValueFrom(item$)
    return GenericItem.fromJson(item)
  }

  async getAll(pageNumber : number) {
    const listaItem$ = this.httpClient.get<GenericItemJSON[]>(this.REST_SERVER_URL_COMPLETO + '/getAll/' + this.usuarioService.getEmpresaId() + '/' + pageNumber)
    const listaItem = await lastValueFrom(listaItem$)
    return listaItem.map((clausula) => GenericItem.fromJson(clausula))
  }

  async getAllCantidad(): Promise<number | PromiseLike<number>> {
    const cant$ = this.httpClient.get<number>(this.REST_SERVER_URL_COMPLETO + '/getAllCantidad/' + this.usuarioService.getEmpresaId())
    this.cantidadClausula = await lastValueFrom(cant$)
    return this.cantidadClausula
  }

  async getAllFiltro(pageNumber: number, buscar: string) {
    const listaItem$ = this.httpClient.get<GenericItemJSON[]>(this.REST_SERVER_URL_COMPLETO + '/getAllFiltro/' + this.usuarioService.getEmpresaId() + '/' + pageNumber + '/' + buscar)
    const listaItem = await lastValueFrom(listaItem$)
    return listaItem.map((clausula) => GenericItem.fromJson(clausula))
  }

  async getAllFiltroCantidad(buscar: string): Promise<number | PromiseLike<number>> {
    const cant$ = this.httpClient.get<number>(this.REST_SERVER_URL_COMPLETO + '/getAllFiltroCantidad/' + this.usuarioService.getEmpresaId() + '/' + buscar)
    this.cantidadClausula = await lastValueFrom(cant$)
    return this.cantidadClausula
  }

  async save(genericItem : GenericItem) {
    genericItem.empresaId = this.usuarioService.getEmpresaId()
    const item$ = this.httpClient.post<GenericItem>(this.REST_SERVER_URL_COMPLETO + '/save', genericItem)
    return await lastValueFrom(item$)
  }

  async delete(id : number) {
    return this.httpClient.delete<GenericItem>(this.REST_SERVER_URL_COMPLETO + '/delete/' + id + "/" + this.usuarioService.getEmpresaId())
  }

  async getAllAgregar() {
    const listaItem$ = this.httpClient.get<GenericItemJSON[]>(this.REST_SERVER_URL_COMPLETO + '/getAllAgregar/' + this.usuarioService.getEmpresaId())
    const listaItem = await lastValueFrom(listaItem$)
    return listaItem.map((clausula) => GenericItem.fromJson(clausula))
  }

}
