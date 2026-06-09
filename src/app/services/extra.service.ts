import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { REST_SERVER_URL } from 'src/util/configuration';
import { Extra, ExtraJSON, ExtraPrecioDTO } from '../model/Extra';
import { FechaForm } from '../model/FechaForm';
import { GenericItem, GenericItemEmpresaTipoEvento, GenericItemEmpresaTipoEventoJSON } from '../model/GenericItem';
import { Precio, PrecioForm, PrecioJSON } from '../model/Precio';
import { UsuarioService } from './usuario.service';

const BASE = `${REST_SERVER_URL}/v1/extras`;

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
      this.httpClient.get<{ data: ExtraJSON }>(`${BASE}/${id}`)
    );
    return Extra.fromJson(res.data);
  }

  // ==================== EVENTO PAGINADO ====================

  async getAllExtraByEmpresaId(pageNumber: number): Promise<Extra[]> {
    const empresaId = this.usuarioService.getEmpresaId();
    const res = await lastValueFrom(
      this.httpClient.get<{ data: ExtraJSON[] }>(
        `${BASE}/empresa/${empresaId}/evento`,
        { params: new HttpParams().set('page', pageNumber) }
      )
    );
    return res.data.map(Extra.fromJson);
  }

  async getAllExtraByFilterName(pageNumber: number, buscar: string): Promise<Extra[]> {
    const empresaId = this.usuarioService.getEmpresaId();
    const res = await lastValueFrom(
      this.httpClient.get<{ data: ExtraJSON[] }>(
        `${BASE}/empresa/${empresaId}/evento/buscar`,
        { params: new HttpParams().set('page', pageNumber).set('buscar', buscar) }
      )
    );
    return res.data.map(Extra.fromJson);
  }

  async cantExtras(): Promise<number> {
    const empresaId = this.usuarioService.getEmpresaId();
    const res = await lastValueFrom(
      this.httpClient.get<{ data: number }>(`${BASE}/empresa/${empresaId}/evento/count`)
    );
    return res.data;
  }

  async cantExtrasFiltrados(buscar: string): Promise<number> {
    const empresaId = this.usuarioService.getEmpresaId();
    const res = await lastValueFrom(
      this.httpClient.get<{ data: number }>(
        `${BASE}/empresa/${empresaId}/evento/count/buscar`,
        { params: new HttpParams().set('buscar', buscar) }
      )
    );
    return res.data;
  }

  // ==================== CATERING PAGINADO ====================

  async getAllExtraCateringByEmpresaId(pageNumber: number): Promise<Extra[]> {
    const empresaId = this.usuarioService.getEmpresaId();
    const res = await lastValueFrom(
      this.httpClient.get<{ data: ExtraJSON[] }>(
        `${BASE}/empresa/${empresaId}/catering`,
        { params: new HttpParams().set('page', pageNumber) }
      )
    );
    return res.data.map(Extra.fromJson);
  }

  async getAllExtraCateringFilter(pageNumber: number, buscar: string): Promise<Extra[]> {
    const empresaId = this.usuarioService.getEmpresaId();
    const res = await lastValueFrom(
      this.httpClient.get<{ data: ExtraJSON[] }>(
        `${BASE}/empresa/${empresaId}/catering/buscar`,
        { params: new HttpParams().set('page', pageNumber).set('buscar', buscar) }
      )
    );
    return res.data.map(Extra.fromJson);
  }

  async cantExtraCatering(): Promise<number> {
    const empresaId = this.usuarioService.getEmpresaId();
    const res = await lastValueFrom(
      this.httpClient.get<{ data: number }>(`${BASE}/empresa/${empresaId}/catering/count`)
    );
    return res.data;
  }

  async cantExtraCateringFilter(buscar: string): Promise<number> {
    const empresaId = this.usuarioService.getEmpresaId();
    const res = await lastValueFrom(
      this.httpClient.get<{ data: number }>(
        `${BASE}/empresa/${empresaId}/catering/count/buscar`,
        { params: new HttpParams().set('buscar', buscar) }
      )
    );
    return res.data;
  }

  // ==================== LISTAS GLOBALES ====================

  async getAllExtraEvento(): Promise<Extra[]> {
    const res = await lastValueFrom(
      this.httpClient.get<{ data: ExtraJSON[] }>(`${BASE}/evento`)
    );
    return res.data.map(Extra.fromJson);
  }

  async getAllExtraCatering(): Promise<Extra[]> {
    const res = await lastValueFrom(
      this.httpClient.get<{ data: ExtraJSON[] }>(`${BASE}/catering`)
    );
    return res.data.map(Extra.fromJson);
  }

  async getAllExtraEventoAgregar(): Promise<GenericItemEmpresaTipoEventoJSON[]> {
    const empresaId = this.usuarioService.getEmpresaId();
    const res = await lastValueFrom(
      this.httpClient.get<{ data: Extra[] }>(`${BASE}/empresa/${empresaId}/evento/agregar`)
    );
    return res.data.map(GenericItemEmpresaTipoEvento.fromJson);
  }

  async getAllExtraCateringAgregar(): Promise<GenericItem[]> {
    const empresaId = this.usuarioService.getEmpresaId();
    const res = await lastValueFrom(
      this.httpClient.get<{ data: Extra[] }>(`${BASE}/empresa/${empresaId}/catering/agregar`)
    );
    return res.data.map(GenericItem.fromJson);
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
    tipoExtra: string
  ): Promise<ExtraPrecioDTO[]> {
    const empresaId = this.usuarioService.getEmpresaId();
    
    const res = await lastValueFrom(
      this.httpClient.get<{ data: ExtraPrecioDTO[] }>(
        `${BASE}/empresa/${empresaId}/tipo-evento/${tipoEventoId}/precio`,
        { params: new HttpParams().set('fechaEvento', fechaEvento).set('tipoExtra', tipoExtra) }
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