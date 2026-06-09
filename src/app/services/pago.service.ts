import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { REST_SERVER_URL } from 'src/util/configuration';
import { Pago, PagoJSON } from '../model/Pago';
import { LoginService } from './login.service';
import { EventoPago } from '../model/Evento';
import { UsuarioService } from './usuario.service';

const BASE = `${REST_SERVER_URL}/v1/pagos`;

@Injectable({
  providedIn: 'root'
})
export class PagoService {

  constructor(
    private httpClient: HttpClient,
    private usuarioService: UsuarioService,
    private loginService: LoginService
  ) {}

  // ── Queries ──────────────────────────────────────────────────────────────

  async get(id: number) {
    const item$ = this.httpClient.get<{ data: PagoJSON }>(`${BASE}/${id}`);
    const res = await lastValueFrom(item$);
    return Pago.fromJson(res.data);
  }

  async getAllPagoByEmpresaId(pageNumber: number) {
    const empresaId = this.usuarioService.getEmpresaId();
    const listaItem$ = this.httpClient.get<{ data: PagoJSON[] }>(
      `${BASE}/empresa/${empresaId}`,
      { params: { page: pageNumber } }
    );
    const res = await lastValueFrom(listaItem$);
    return res.data.map((pago) => Pago.fromJson(pago));
  }

  async getAllPagoByFilter(pageNumber: number, buscar: string) {
    const empresaId = this.usuarioService.getEmpresaId();
    const listaItem$ = this.httpClient.get<{ data: PagoJSON[] }>(
      `${BASE}/empresa/${empresaId}/filtrar`,
      { params: { buscar, page: pageNumber } }
    );
    const res = await lastValueFrom(listaItem$);
    return res.data.map((pago) => Pago.fromJson(pago));
  }

  async cantPagos(): Promise<number> {
    const empresaId = this.usuarioService.getEmpresaId();
    const cant$ = this.httpClient.get<{ data: number }>(`${BASE}/empresa/${empresaId}/cantidad`);
    const res = await lastValueFrom(cant$);
    return res.data;
  }

  async cantPagosFiltrados(buscar: string): Promise<number> {
    const empresaId = this.usuarioService.getEmpresaId();
    const cant$ = this.httpClient.get<{ data: number }>(
      `${BASE}/empresa/${empresaId}/filtrar/cantidad`,
      { params: { buscar } }
    );
    const res = await lastValueFrom(cant$);
    return res.data;
  }

  async getAllMedioDePago() {
    const listaItem$ = this.httpClient.get<{ data: string[] }>(`${BASE}/medios-de-pago`);
    const res = await lastValueFrom(listaItem$);
    return res.data;
  }

  async getAllConcepto() {
    const listaItem$ = this.httpClient.get<{ data: string[] }>(`${BASE}/conceptos`);
    const res = await lastValueFrom(listaItem$);
    return res.data;
  }

  async getEventoForSavePago(eventoId: number) {
    const evento$ = this.httpClient.get<{ data: Pago }>(`${BASE}/evento/${eventoId}/datos-para-pago`);
    const res = await lastValueFrom(evento$);
    return res.data;
  }

  async getEventoForEditEventoPago(eventoId: number) {
    const evento$ = this.httpClient.get<{ data: EventoPago }>(`${BASE}/evento/${eventoId}/estado-cuenta`);
    const res = await lastValueFrom(evento$);
    return res.data;
  }

  async getAllPagoFromEvento(eventoId: number) {
    const evento$ = this.httpClient.get<{ data: Pago[] }>(`${BASE}/evento/${eventoId}`);
    const res = await lastValueFrom(evento$);
    return res.data;
  }

  // ── Mutations ────────────────────────────────────────────────────────────

  async save(pago: Pago) {
    pago.empresaId = this.usuarioService.getEmpresaId();
    pago.usuarioId = await this.loginService.getUsuarioId();
    const item$ = this.httpClient.post<{ data: Pago }>(`${BASE}`, pago);
    const res = await lastValueFrom(item$);
    return res.data;
  }

  async delete(id: number) {
    const delete$ = this.httpClient.delete<{ data: string }>(`${BASE}/${id}`);
    return await lastValueFrom(delete$);
  }

  // ── Comprobantes y email ──────────────────────────────────────────────────

  async descargarPago(id: number): Promise<Blob> {
    const item$ = this.httpClient.get(`${BASE}/${id}/comprobante`, { responseType: 'blob' });
    return lastValueFrom(item$);
  }

  async enviarEmailPago(pagoId: number, eventoId: number): Promise<boolean> {
    const empresaId = this.usuarioService.getEmpresaId();
    const item$ = this.httpClient.get<{ data: boolean }>(
      `${BASE}/${pagoId}/email/evento/${eventoId}/empresa/${empresaId}`
    );
    const res = await lastValueFrom(item$);
    return res.data;
  }

  async descargarEstadoCuenta(eventoId: number): Promise<Blob> {
    const item$ = this.httpClient.get(`${BASE}/evento/${eventoId}/estado-cuenta/pdf`, { responseType: 'blob' });
    return lastValueFrom(item$);
  }

  async enviarEmailEstadoCuenta(eventoId: number): Promise<boolean> {
    const empresaId = this.usuarioService.getEmpresaId();
    const item$ = this.httpClient.get<{ data: boolean }>(
      `${BASE}/evento/${eventoId}/estado-cuenta/email/empresa/${empresaId}`
    );
    const res = await lastValueFrom(item$);
    return res.data;
  }
}