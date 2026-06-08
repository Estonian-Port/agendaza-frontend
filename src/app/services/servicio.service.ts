import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { REST_SERVER_URL } from 'src/util/configuration';
import { GenericItem, GenericItemEmpresaTipoEvento, GenericItemEmpresaTipoEventoJSON, GenericItemJSON } from '../model/GenericItem';
import { UsuarioService } from './usuario.service';

const BASE = `${REST_SERVER_URL}/v1/servicios`;

@Injectable({
  providedIn: 'root'
})
export class ServicioService {

  servicioId: number = 0;
  cantidadServicio: number = 0;

  constructor(
    private httpClient: HttpClient,
    private usuarioService: UsuarioService
  ) {}

  // ── Queries ──────────────────────────────────────────────────────────────

  async getServicio(id: number) {
    const item$ = this.httpClient.get<GenericItemEmpresaTipoEventoJSON>(`${BASE}/${id}`);
    const item = await lastValueFrom(item$);
    return GenericItemEmpresaTipoEvento.fromJson(item);
  }

  async getAllServicioByEmpresaId(pageNumber: number) {
    const empresaId = this.usuarioService.getEmpresaId();
    const listaItem$ = this.httpClient.get<{ data: GenericItemJSON[] }>(
      `${BASE}/empresa/${empresaId}`,
      { params: { page: pageNumber } }
    );
    const listaItem = await lastValueFrom(listaItem$);
    return listaItem.data.map((servicio) => GenericItem.fromJson(servicio));
  }

  async getCantidadServicio(): Promise<number> {
    const empresaId = this.usuarioService.getEmpresaId();
    const cant$ = this.httpClient.get<{ data: number }>(`${BASE}/empresa/${empresaId}/cantidad`);
    const res = await lastValueFrom(cant$);
    this.cantidadServicio = res.data;
    return this.cantidadServicio;
  }

  async getAllServicioFiltrados(pageNumber: number, buscar: string) {
    const empresaId = this.usuarioService.getEmpresaId();
    const listaItem$ = this.httpClient.get<{ data: GenericItemJSON[] }>(
      `${BASE}/empresa/${empresaId}/filtrar`,
      { params: { buscar, page: pageNumber } }
    );
    const listaItem = await lastValueFrom(listaItem$);
    return listaItem.data.map((servicio) => GenericItem.fromJson(servicio));
  }

  async cantServicioFiltrados(buscar: string): Promise<number> {
    const empresaId = this.usuarioService.getEmpresaId();
    const cant$ = this.httpClient.get<{ data: number }>(
      `${BASE}/empresa/${empresaId}/filtrar/cantidad`,
      { params: { buscar } }
    );
    const res = await lastValueFrom(cant$);
    this.cantidadServicio = res.data;
    return this.cantidadServicio;
  }

  async getAllServicioByTipoEventoId(tipoEventoId: number) {
    const listaItem$ = this.httpClient.get<{ data: GenericItemJSON[] }>(`${BASE}/tipo-evento/${tipoEventoId}`);
    const listaItem = await lastValueFrom(listaItem$);
    return listaItem.data.map((servicio) => GenericItem.fromJson(servicio));
  }

  async getAllServicioAgregar() {
    const empresaId = this.usuarioService.getEmpresaId();
    const listaItem$ = this.httpClient.get<{ data: GenericItemJSON[] }>(`${BASE}/empresa/${empresaId}/agregar`);
    const listaItem = await lastValueFrom(listaItem$);
    return listaItem.data.map((servicio) => GenericItem.fromJson(servicio));
  }

  // ── Mutations ────────────────────────────────────────────────────────────

  async save(genericItem: GenericItemEmpresaTipoEvento) {
    const payload = new GenericItemEmpresaTipoEvento(
      genericItem.id,
      genericItem.nombre,
      this.usuarioService.getEmpresaId(),
      genericItem.listaTipoEventoId
    );
    const item$ = this.httpClient.post<{ data: GenericItem }>(`${BASE}`, payload);
    const res = await lastValueFrom(item$);
    return res.data;
  }

  async delete(id: number) {
    const empresaId = this.usuarioService.getEmpresaId();
    const delete$ = this.httpClient.delete<{ data: string }>(`${BASE}/${id}/empresa/${empresaId}`);
    return await lastValueFrom(delete$);
  }
}