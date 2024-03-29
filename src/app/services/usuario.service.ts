import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { REST_SERVER_URL } from 'src/util/configuration';
import { Usuario, UsuarioEditPassword, UsuarioEmpresa, UsuarioJSON, UsuarioSave } from '../model/Usuario';
import { AgendaService } from './agenda.service';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  usuarioId : number = 0

  constructor(private httpClient: HttpClient, private agendaService : AgendaService) { }

  async getUsuario(usuarioId: number) {
    const item$ = this.httpClient.get<Usuario>(REST_SERVER_URL + '/getUsuario/' + usuarioId)
    return await lastValueFrom(item$)
  }

  async getUsuarioRolByEmpresaId(usuarioId: number) {
    const item$ = this.httpClient.put<string>(REST_SERVER_URL + '/getRolByUsuarioIdAndEmpresaId', new UsuarioEmpresa(usuarioId, this.agendaService.getEmpresaId()))
    return await lastValueFrom(item$)
  }

  async getAllUsuariosByEmpresaId() {
    const listaItem$ = this.httpClient.get<UsuarioJSON[]>(REST_SERVER_URL + '/getAllUsuarioByEmpresaId/' + this.agendaService.getEmpresaId())
    const listaItem = await lastValueFrom(listaItem$)
    return listaItem.map((usuario) => Usuario.fromJson(usuario))
  }

  async getAllClienteByEmpresaId() {
    const listaItem$ = this.httpClient.get<UsuarioJSON[]>(REST_SERVER_URL + '/getAllClienteByEmpresaId/' + this.agendaService.getEmpresaId())
    const listaItem = await lastValueFrom(listaItem$)
    return listaItem.map((usuario) => Usuario.fromJson(usuario))
  }

  async save(usuario : Usuario) {
    const usuariof = new UsuarioSave(usuario, this.agendaService.getEmpresaId(), usuario.rol)
    const item$ = this.httpClient.post<UsuarioJSON>(REST_SERVER_URL + '/saveUsuario', usuariof)
    const item = await lastValueFrom(item$)
    return item
  }

  async editPassword(usuarioEditPassword : UsuarioEditPassword) {
    const listaItem$ = this.httpClient.post<Usuario>(REST_SERVER_URL + '/editPassword', usuarioEditPassword)
    return await lastValueFrom(listaItem$)
  }

  async getAllRol() {
    const listaItem$ = this.httpClient.get<string[]>(REST_SERVER_URL + '/getAllRol')
    return await lastValueFrom(listaItem$)
  }

  async getAllSexo() {
    const listaItem$ = this.httpClient.get<string[]>(REST_SERVER_URL + '/getAllSexo')
    return await lastValueFrom(listaItem$)
  }



}
