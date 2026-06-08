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
import { UsuarioService } from './usuario.service';

const BASE = `${REST_SERVER_URL}/v1/tipos-evento`;

@Injectable({
  providedIn: 'root'
})
export class TipoEventoService {

  constructor(
    private httpClient: HttpClient,
    private usuarioService: UsuarioService
  ) {}

  // ── Queries ──────────────────────────────────────────────────────────────

  async getTipoEvento(id: number) {
    const item$ = this.httpClient.get<{ data: TipoEventoEditJSON }>(`${BASE}/${id}`);
    const res = await lastValueFrom(item$);
    return TipoEvento.fromTipoEventoEditJson(res.data);
  }

  /** Sin paginación — para selects y combos en formularios */
  async getAllTipoEventoByEmpresaId() {
    const empresaId = this.usuarioService.getEmpresaId();
    const listaItem$ = this.httpClient.get<{ data: TipoEventoJSON[] }>(`${BASE}/empresa/${empresaId}/todos`);
    const res = await lastValueFrom(listaItem$);
    return res.data.map((te) => TipoEvento.fromTipoEventoJson(te));
  }

  /** Con paginación — para la grilla ABM */
  async getAllTipoEventoByEmpresaIdAbm(pageNumber: number) {
    const empresaId = this.usuarioService.getEmpresaId();
    const listaItem$ = this.httpClient.get<{ data: TipoEventoJSON[] }>(
      `${BASE}/empresa/${empresaId}`,
      { params: { page: pageNumber } }
    );
    const res = await lastValueFrom(listaItem$);
    return res.data.map((te) => GenericItem.fromJson(te));
  }

  async getCantidadTipoEvento(): Promise<number> {
    const empresaId = this.usuarioService.getEmpresaId();
    const cant$ = this.httpClient.get<{ data: number }>(`${BASE}/empresa/${empresaId}/cantidad`);
    const res = await lastValueFrom(cant$);
    return res.data;
  }

  async getAllTipoEventoFiltrados(pageNumber: number, buscar: string) {
    const empresaId = this.usuarioService.getEmpresaId();
    const listaItem$ = this.httpClient.get<{ data: TipoEventoJSON[] }>(
      `${BASE}/empresa/${empresaId}/filtrar`,
      { params: { buscar, page: pageNumber } }
    );
    const res = await lastValueFrom(listaItem$);
    return res.data.map((te) => GenericItem.fromJson(te));
  }

  async cantTipoEventoFiltrados(buscar: string): Promise<number> {
    const empresaId = this.usuarioService.getEmpresaId();
    const cant$ = this.httpClient.get<{ data: number }>(
      `${BASE}/empresa/${empresaId}/filtrar/cantidad`,
      { params: { buscar } }
    );
    const res = await lastValueFrom(cant$);
    return res.data;
  }

  async getAllDuracion() {
    const listaItem$ = this.httpClient.get<{ data: string[] }>(`${BASE}/duraciones`);
    const res = await lastValueFrom(listaItem$);
    return res.data;
  }

  async getDuracionByTipoEventoId(tipoEventoId: number) {
    const time$ = this.httpClient.get<{ data: string }>(`${BASE}/${tipoEventoId}/duracion`);
    const res = await lastValueFrom(time$);
    return new Time(res.data.substring(0, 2), res.data.substring(3, 5));
  }

  async getCapacidadByTipoEventoId(tipoEventoId: number) {
    const cap$ = this.httpClient.get<{ data: Capacidad }>(`${BASE}/${tipoEventoId}/capacidad`);
    const res = await lastValueFrom(cap$);
    return res.data;
  }

  async getTimeEndByTipoEventoIdAndTimeStart(tipoEventoId: number, timeStart: Time) {
    const time$ = this.httpClient.put<{ data: string }>(`${BASE}/${tipoEventoId}/hora-fin`, timeStart);
    const res = await lastValueFrom(time$);
    return new Time(res.data.substring(0, 2), res.data.substring(3, 5));
  }

  async findExtraNinoByTipoEventoId(tipoEventoId: number) {
    const extra$ = this.httpClient.get<{ data: ExtraVariable }>(`${BASE}/${tipoEventoId}/extra-nino`);
    const res = await lastValueFrom(extra$);
    return res.data;
  }

  async findExtraCamareraByTipoEventoId(tipoEventoId: number) {
    const extra$ = this.httpClient.get<{ data: ExtraVariable }>(`${BASE}/${tipoEventoId}/extra-camarera`);
    const res = await lastValueFrom(extra$);
    return res.data;
  }

  // ── Precios ──────────────────────────────────────────────────────────────

  async getAllPrecioConFechaByTipoEventoId(tipoEventoId: number) {
    const empresaId = this.usuarioService.getEmpresaId();
    const listaItem$ = this.httpClient.get<{ data: PrecioJSON[] }>(
      `${BASE}/empresa/${empresaId}/${tipoEventoId}/precios`
    );
    const res = await lastValueFrom(listaItem$);
    return res.data.map((precio) => Precio.toForm(Precio.fromJson(precio)));
  }

  async getPrecioByTipoEventoIdAndFecha(tipoEventoId: number, fechaInicio: FechaForm) {
    const empresaId = this.usuarioService.getEmpresaId();
    const precio$ = this.httpClient.put<{ data: number }>(
      `${BASE}/empresa/${empresaId}/${tipoEventoId}/precio-por-fecha`,
      new Date(fechaInicio.year, fechaInicio.mes, fechaInicio.dia)
    );
    const res = await lastValueFrom(precio$);
    return res.data;
  }

  async savePrecio(tipoEventoId: number, listaPrecioForm: PrecioForm[]) {
    const empresaId = this.usuarioService.getEmpresaId();
    const listaPrecio = listaPrecioForm.map((p) => Precio.fromForm(p, empresaId, tipoEventoId));
    const item$ = this.httpClient.post<{ data: GenericItem }>(
      `${BASE}/empresa/${empresaId}/${tipoEventoId}/precios`,
      listaPrecio
    );
    const res = await lastValueFrom(item$);
    return res.data;
  }

  // ── Mutations ────────────────────────────────────────────────────────────

  async save(tipoEvento: TipoEvento) {
    tipoEvento.empresaId = this.usuarioService.getEmpresaId();
    const item$ = this.httpClient.post<{ data: GenericItem }>(`${BASE}`, tipoEvento.toJSON());
    const res = await lastValueFrom(item$);
    return res.data;
  }

  async delete(id: number) {
    const delete$ = this.httpClient.delete<{ data: GenericItem }>(`${BASE}/${id}`);
    return await lastValueFrom(delete$);
  }
}