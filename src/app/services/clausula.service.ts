import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GenericItem, GenericItemJSON } from '../model/GenericItem';
import { REST_SERVER_URL } from 'src/util/configuration';
import { lastValueFrom } from 'rxjs';
import { UsuarioService } from './usuario.service';

const BASE = `${REST_SERVER_URL}/clausula`

@Injectable({
  providedIn: 'root'
})
export class ClausulaService {

  constructor(private httpClient: HttpClient, private usuarioService : UsuarioService){}

  async get(id : number) {
    const item$ = this.httpClient.get<GenericItem>(`${BASE}/get/${id}`)
    const item = await lastValueFrom(item$)
    return GenericItem.fromJson(item)
  }

  async getAll(pageNumber : number) {
    const listaItem$ = this.httpClient.get<GenericItemJSON[]>(`${BASE}/getAll/${this.usuarioService.getEmpresaId()}/${pageNumber}`)
    const listaItem = await lastValueFrom(listaItem$)
    return listaItem.map((clausula) => GenericItem.fromJson(clausula))
  }

  async getAllCantidad(): Promise<number | PromiseLike<number>> {
    const cant$ = this.httpClient.get<number>(`${BASE}/getAllCantidad/${this.usuarioService.getEmpresaId()}`)
    return await lastValueFrom(cant$)
  }

  async getAllFiltro(pageNumber: number, buscar: string) {
    const listaItem$ = this.httpClient.get<GenericItemJSON[]>(`${BASE}/getAllFiltro/${this.usuarioService.getEmpresaId()}/${pageNumber}/${buscar}`)
    const listaItem = await lastValueFrom(listaItem$)
    return listaItem.map((clausula) => GenericItem.fromJson(clausula))
  }

  async getAllFiltroCantidad(buscar: string): Promise<number | PromiseLike<number>> {
    const cant$ = this.httpClient.get<number>(`${BASE}/getAllFiltroCantidad/${this.usuarioService.getEmpresaId()}/${buscar}`)
    return await lastValueFrom(cant$)
  }

  async save(genericItem : GenericItem) {
    genericItem.empresaId = this.usuarioService.getEmpresaId()
    const item$ = this.httpClient.post<GenericItem>(`${BASE}/save`, genericItem)
    return await lastValueFrom(item$)
  }

  async delete(id : number) {
    return this.httpClient.delete<GenericItem>(`${BASE}/delete/${id}/${this.usuarioService.getEmpresaId()}`)
  }

  async getAllAgregar() {
    const listaItem$ = this.httpClient.get<GenericItemJSON[]>(`${BASE}/getAllAgregar/${this.usuarioService.getEmpresaId()}`)
    const listaItem = await lastValueFrom(listaItem$)
    return listaItem.map((clausula) => GenericItem.fromJson(clausula))
  }

}
