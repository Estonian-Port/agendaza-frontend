import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { GenericItem, GenericItemJSON } from '../model/GenericItem';
import { REST_SERVER_URL } from 'src/util/configuration';
import { lastValueFrom } from 'rxjs';
import { UsuarioService } from './usuario.service';

const BASE = `${REST_SERVER_URL}/v1/clausula`

@Injectable({
  providedIn: 'root'
})
export class ClausulaService {

  constructor(private httpClient: HttpClient, private usuarioService : UsuarioService){}

  async getAll(pageNumber: number, buscar?: string): Promise<GenericItem[]> {
    let params = new HttpParams().set('page', pageNumber)
    if (buscar) {
      params = params.set('buscar', buscar)
    }

    const response$ = this.httpClient.get<{ data: GenericItemJSON[] }>(
      `${BASE}/empresa/${this.usuarioService.getEmpresaId()}`,
      { params }
    )
    const response = await lastValueFrom(response$)
    return response.data.map((clausula) => GenericItem.fromJson(clausula))
  }

  async getAllCantidad(buscar?: string): Promise<number> {
    let params = new HttpParams()
    if (buscar) {
      params = params.set('buscar', buscar)
    }

    const response$ = this.httpClient.get<{ data: number }>(
      `${BASE}/empresa/${this.usuarioService.getEmpresaId()}/count`,
      { params }
    )
    const response = await lastValueFrom(response$)
    return response.data
  }

  async save(genericItem : GenericItem) {
    genericItem.empresaId = this.usuarioService.getEmpresaId()
    const item$ = this.httpClient.post<GenericItem>(`${BASE}/save`, genericItem)
    return await lastValueFrom(item$)
  }

  async delete(id : number) {
    return this.httpClient.delete<void>(`${BASE}/delete/${id}/${this.usuarioService.getEmpresaId()}`)
  }

}
