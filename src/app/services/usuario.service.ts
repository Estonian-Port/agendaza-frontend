import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { REST_SERVER_URL } from 'src/util/configuration';
import { Cliente, Usuario, UsuarioEditCargo, UsuarioEditPassword, UsuarioEmpresa, UsuarioJSON, UsuarioSave } from '../model/Usuario';
import { AgendaService } from './agenda.service';
import { Cargo } from '../model/Cargo';
import { CryptoJsImpl } from 'src/util/cryptoJsImpl';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  usuarioId : number = 0
  cantidadUsuarios : number = 0
  perfilVolver : String = ""
  
  constructor(private httpClient: HttpClient, private agendaService : AgendaService) { }

  async getUsuario() {
    const item$ = this.httpClient.get<Usuario>(REST_SERVER_URL + '/getUsuarioOfEmpresa/' + this.usuarioId + '/' + this.agendaService.getEmpresaId())
    return await lastValueFrom(item$)
  }

  async getAllUsuario(pageNumber : number) {
    const listaItem$ = this.httpClient.get<UsuarioJSON[]>(REST_SERVER_URL + '/getAllUsuario/' + this.agendaService.getEmpresaId() + '/' + pageNumber)
    const listaItem = await lastValueFrom(listaItem$)
    return listaItem.map((usuario) => Usuario.fromJson(usuario))
  }

  async getCantidadUsuario(){
    const cant$ = this.httpClient.get<number>(REST_SERVER_URL + '/getCantidadUsuario/' + this.agendaService.getEmpresaId())
    this.cantidadUsuarios = await lastValueFrom(cant$)
    return this.cantidadUsuarios
  }

  async getAllUsuarioFiltrados(pageNumber : number, buscar : string){
    const listaItem$ = this.httpClient.get<UsuarioJSON[]>(REST_SERVER_URL + '/getAllUsuarioFiltrados/' + this.agendaService.getEmpresaId() + '/' + pageNumber + '/' + buscar)
    const listaItem = await lastValueFrom(listaItem$)
    return listaItem.map((usuario) => Usuario.fromJson(usuario))
  }
  
  async getCantidadUsuarioFiltrados(buscar : string){
    const cant$ = this.httpClient.get<number>(REST_SERVER_URL + '/getCantidadUsuarioFiltrados/' + this.agendaService.getEmpresaId() + '/' + buscar)
    return await lastValueFrom(cant$)
  }

  async getAllCliente(pageNumber : number) {
    const listaItem$ = this.httpClient.get<UsuarioJSON[]>(REST_SERVER_URL + '/getAllCliente/' + this.agendaService.getEmpresaId() + '/' + pageNumber)
    const listaItem = await lastValueFrom(listaItem$)
    return listaItem.map((usuario) => Usuario.fromJson(usuario))
  }

  async getCantidadCliente(){
    const cant$ = this.httpClient.get<number>(REST_SERVER_URL + '/getCantidadCliente/' + this.agendaService.getEmpresaId())
    this.cantidadUsuarios = await lastValueFrom(cant$)
    return this.cantidadUsuarios
  }

  async getAllClienteFiltrados(pageNumber : number, buscar : string){
    const listaItem$ = this.httpClient.get<UsuarioJSON[]>(REST_SERVER_URL + '/getAllClienteFiltrados/' + this.agendaService.getEmpresaId() + '/' + pageNumber + '/' + buscar)
    const listaItem = await lastValueFrom(listaItem$)
    return listaItem.map((usuario) => Usuario.fromJson(usuario))
  }
  
  async getCantidadClienteFiltrados(buscar : string){
    const cant$ = this.httpClient.get<number>(REST_SERVER_URL + '/getCantidadClienteFiltrados/' + this.agendaService.getEmpresaId() + '/' + buscar)
    return await lastValueFrom(cant$)
  }

  async save(usuario : Usuario) {
    var empresaId = 0
    if(this.agendaService.getEmpresaId() != "" && this.agendaService.getEmpresaId != null){
      empresaId = this.agendaService.getEmpresaId()
    }
    const usuariof = new UsuarioSave(usuario, empresaId, usuario.cargo)
    const item$ = this.httpClient.post<UsuarioJSON>(REST_SERVER_URL + '/saveUsuario', usuariof)
    const item = await lastValueFrom(item$)

    //modifica el username q esta en el session storage
    const username = CryptoJsImpl.encryptData(item.username)
    localStorage.setItem('session', username)
    return item
  }

  async saveCargo(usuario: Usuario) {
    const item$ = this.httpClient.post<UsuarioJSON>(REST_SERVER_URL + '/saveUsuarioCargoOfEmpresa', 
      new UsuarioEditCargo(usuario.id, this.agendaService.getEmpresaId(), usuario.cargo))
    return await lastValueFrom(item$)
  }

  async editPassword(usuarioEditPassword : UsuarioEditPassword) {
    const listaItem$ = this.httpClient.post<Usuario>(REST_SERVER_URL + '/editPassword', usuarioEditPassword)
    return await lastValueFrom(listaItem$)
  }

  async getAllCargo() {
    const listaItem$ = this.httpClient.get<Cargo[]>(REST_SERVER_URL + '/getAllCargo')
    return await lastValueFrom(listaItem$)
  }

  async getEventosByUsuarioAndEmpresa(usuarioId: number) {
    const listaEvento$ = this.httpClient.put<string[]>(REST_SERVER_URL + '/getEventosByUsuarioAndEmpresa', new UsuarioEmpresa(usuarioId, this.agendaService.getEmpresaId()))
    return await lastValueFrom(listaEvento$)
  }

  async getCantEventosByUsuarioAndEmpresa(usuarioId: number) {
    const cant$ = this.httpClient.put<number>(REST_SERVER_URL + '/getCantEventosByUsuarioAndEmpresa', new UsuarioEmpresa(usuarioId, this.agendaService.getEmpresaId()))
    return await lastValueFrom(cant$)
  }

  async deleteCargo(usuarioId: number) {
    return this.httpClient.delete<any>(REST_SERVER_URL + '/deleteCargo/' + this.agendaService.getEmpresaId() + '/'+ usuarioId)
  }
  
  async saveCliente(cliente: Cliente){
    const item$ = this.httpClient.post<Cliente>(REST_SERVER_URL + '/saveCliente', cliente)
    return await lastValueFrom(item$)
  }
}
