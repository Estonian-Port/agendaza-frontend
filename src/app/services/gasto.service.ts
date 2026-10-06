import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { Gasto } from '../model/Gasto';
import { REST_SERVER_URL } from 'src/util/configuration';
import { UsuarioService } from './usuario.service';
import { LoginService } from './login.service';

const BASE = `${REST_SERVER_URL}/v1/gastos`;

@Injectable({ providedIn: 'root' })
export class GastoService {

  constructor(
    private http: HttpClient,
    private usuarioService: UsuarioService,
    private loginService: LoginService

  ) { }

  async getAllTipoGasto(): Promise<string[]> {
    const r: any = await lastValueFrom(this.http.get(`${BASE}/tipos`))
    return r.data
  }

  async get(id: number): Promise<Gasto> {
    const r: any = await lastValueFrom(this.http.get(`${BASE}/${id}`))
    return r.data
  }

  async getAllGastoByMes(mes: number, anio: number): Promise<Gasto[]> {
    const r: any = await lastValueFrom(
      this.http.get(`${BASE}/empresa/${this.usuarioService.getEmpresaId()}/mes`, { params: { mes, anio } }))
    return r.data
  }

  async save(gasto: Gasto): Promise<Gasto> {
    gasto.empresaId = this.usuarioService.getEmpresaId();
    gasto.usuarioId = this.loginService.getUsuarioId();
    if (!gasto.codigoEvento) gasto.codigoEvento = undefined
    const r: any = await lastValueFrom(this.http.post(BASE, gasto))
    return r.data
  }

  async delete(id: number): Promise<void> {
    await lastValueFrom(this.http.delete(`${BASE}/${id}`))
  }
}