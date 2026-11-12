import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { API_URL } from 'src/util/configuration';
import { Extra, ExtraJSON, ExtraPrecioDTO } from '../model/Extra';
import { GenericItemEmpresaTipoEvento } from '../model/GenericItem';
import { Precio, PrecioForm, PrecioJSON } from '../model/Precio';
import { UsuarioService } from './usuario.service';

const BASE = `${API_URL}/v1/extras`;

@Injectable({
  providedIn: 'root'
})
export class ExtraService {

  constructor(
    private httpClient: HttpClient,
    private usuarioService: UsuarioService
  ) {}

  // ==================== METADATA ====================

  async getAllEventoTipoExtra(): Promise<string[]> {
    return lastValueFrom(
      this.httpClient.get<{ data: string[] }>(`${BASE}/tipos/evento`)
    ).then(r => r.data);
  }

  async getAllCateringTipoExtra(): Promise<string[]> {
    return lastValueFrom(
      this.httpClient.get<{ data: string[] }>(`${BASE}/tipos/catering`)
    ).then(r => r.data);
  }

  // ==================== OBTENER EXTRA ====================

  async getExtra(id: number): Promise<Extra> {
    const res = await lastValueFrom(
      this.httpClient.get<{ data: ExtraJSON }>(`${BASE}/${id}/empresa/${this.usuarioService.getEmpresaId()}`)
    );
    return Extra.fromJson(res.data);
  }

  async buscarExtraEvento(q: string): Promise<GenericItemEmpresaTipoEvento[]> {
    return this.buscarExtra(q, ['EVENTO', 'VARIABLE_EVENTO']);
  }

  async buscarExtraCatering(q: string): Promise<GenericItemEmpresaTipoEvento[]> {
    return this.buscarExtra(q, ['TIPO_CATERING', 'VARIABLE_CATERING']);
  }

  private async buscarExtra(q: string, tipos: string[]): Promise<GenericItemEmpresaTipoEvento[]> {
    const params = new HttpParams()
      .set('q', q)
      .set('tipos', tipos.join(','));
    const res = await lastValueFrom(
      this.httpClient.get<{ data: GenericItemEmpresaTipoEvento[] }>(
        `${BASE}/empresa/${this.usuarioService.getEmpresaId()}/buscar`,
        { params }
      )
    );
    return res.data;
  }

  // ==================== EVENTO PAGINADO ====================

  async getAllExtraByEmpresaId(pageNumber: number): Promise<Extra[]> {
    return this.getPageByTipoExtra(['EVENTO', 'VARIABLE_EVENTO'], pageNumber);
  }

  async getAllExtraByFilterName(pageNumber: number, buscar: string): Promise<Extra[]> {
    return this.getPageByTipoExtra(['EVENTO', 'VARIABLE_EVENTO'], pageNumber, buscar);
  }

  async cantExtras(): Promise<number> {
    return this.getCountByTipoExtra(['EVENTO', 'VARIABLE_EVENTO']);
  }

  async cantExtrasFiltrados(buscar: string): Promise<number> {
    return this.getCountByTipoExtra(['EVENTO', 'VARIABLE_EVENTO'], buscar);
  }

  // ==================== CATERING PAGINADO ====================

  async getAllExtraCateringByEmpresaId(pageNumber: number): Promise<Extra[]> {
    return this.getPageByTipoExtra(['TIPO_CATERING', 'VARIABLE_CATERING'], pageNumber);
  }

  async getAllExtraCateringFilter(pageNumber: number, buscar: string): Promise<Extra[]> {
    return this.getPageByTipoExtra(['TIPO_CATERING', 'VARIABLE_CATERING'], pageNumber, buscar);
  }

  async cantExtraCatering(): Promise<number> {
    return this.getCountByTipoExtra(['TIPO_CATERING', 'VARIABLE_CATERING']);
  }

  async cantExtraCateringFilter(buscar: string): Promise<number> {
    return this.getCountByTipoExtra(['TIPO_CATERING', 'VARIABLE_CATERING'], buscar);
  }

  private async getPageByTipoExtra(tiposExtra: string[], pageNumber: number, buscar?: string): Promise<Extra[]> {
    const empresaId = this.usuarioService.getEmpresaId();
    let params = new HttpParams()
      .set('page', pageNumber)
      .set('tiposExtra', tiposExtra.join(','));

    if (buscar) {
      params = params.set('buscar', buscar);
    }

    const res = await lastValueFrom(
      this.httpClient.get<{ data: ExtraJSON[] }>(`${BASE}/empresa/${empresaId}`, { params })
    );
    return res.data.map(Extra.fromJson);
  }

  private async getCountByTipoExtra(tiposExtra: string[], buscar?: string): Promise<number> {
    const empresaId = this.usuarioService.getEmpresaId();
    
    let params = new HttpParams().set('tiposExtra', tiposExtra.join(','));

    if (buscar) {
      params = params.set('buscar', buscar);
    }

    const res = await lastValueFrom(
      this.httpClient.get<{ data: number }>(`${BASE}/empresa/${empresaId}/count`, { params })
    );
    return res.data;
  }

  // ==================== PRECIO ====================

  async getAllPrecioConFechaByExtraId(extraId: number): Promise<PrecioForm[]> {
    const empresaId = this.usuarioService.getEmpresaId();
    const res = await lastValueFrom(
      this.httpClient.get<{ data: PrecioJSON[] }>(`${BASE}/${extraId}/empresa/${empresaId}/precios`)
    );
    return res.data.map(p => Precio.toForm(Precio.fromJson(p)));
  }

  async savePrecio(extraId: number, listaPrecioForm: PrecioForm[]): Promise<void> {
    const empresaId = this.usuarioService.getEmpresaId();
    const listaPrecio = listaPrecioForm.map(p => Precio.fromForm(p, empresaId, extraId));
    await lastValueFrom(
      this.httpClient.post<void>(
        `${BASE}/${extraId}/empresa/${empresaId}/precios`,
        listaPrecio
      )
    );
  }

  async getAllExtraEventoByTipoEventoIdAndFecha(
    tipoEventoId: number,
    fechaEvento: string,
    tiposExtra: string[]
  ): Promise<ExtraPrecioDTO[]> {
    const empresaId = this.usuarioService.getEmpresaId();
    let params = new HttpParams()
      .set('fechaEvento', fechaEvento)
      .set('tiposExtra', tiposExtra.join(','));

    const res = await lastValueFrom(
      this.httpClient.get<{ data: ExtraPrecioDTO[] }>(
        `${BASE}/empresa/${empresaId}/tipo-evento/${tipoEventoId}/precio`,
        { params }
      )
    );

    return res.data;
  }
  // ==================== ABM ====================

  async save(extra: Extra): Promise<Extra> {
    extra.empresaId = this.usuarioService.getEmpresaId();
    const res = await lastValueFrom(
      this.httpClient.post<{ data: Extra }>(`${BASE}`, extra)
    );
    return res.data;
  }

  delete(id: number) {
    const empresaId = this.usuarioService.getEmpresaId();
    return this.httpClient.delete<void>(`${BASE}/${id}/empresa/${empresaId}`);
  }
}