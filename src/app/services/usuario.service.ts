import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { lastValueFrom } from 'rxjs'
import { REST_SERVER_URL } from 'src/util/configuration'
import {
  Cliente,
  Usuario,
  UsuarioEditCargo,
  UsuarioEditPassword,
  UsuarioEmpresa,
  UsuarioJSON,
  UsuarioSave,
} from '../model/Usuario'
import { LoginService } from './login.service'
import { Cargo } from '../model/Cargo'
import { CryptoJsImpl } from 'src/util/cryptoJsImpl'
import { AgendaCard, AgendaCardJSON } from '../model/Agenda'
import { CustomResponse } from 'src/util/customResponse'

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  cantidadUsuarios: number = 0
  perfilVolver: String = ""
  usuarioId: number = 0

  constructor(
    private httpClient: HttpClient,
    private loginService: LoginService
  ) { }

  // ==================== GESTIÓN DE EMPRESA ====================

  setEmpresaId(empresaId: number): void {
    const empresaIdEncrypt = CryptoJsImpl.encryptData(empresaId)
    localStorage.setItem('empresa', empresaIdEncrypt)
  }

  getEmpresaId(): number {
    const empresa = localStorage.getItem('empresa')
    if (empresa != null) {
      return CryptoJsImpl.decryptData(empresa)
    }
    return 0
  }

  removeEmpresaId(): void {
    localStorage.removeItem('empresa')
  }

  async getAllEmpresaByUsuarioId(usuarioId: number): Promise<AgendaCard[]> {
    const response$ = this.httpClient.get<CustomResponse<AgendaCardJSON[]>>(
      `${REST_SERVER_URL}/v1/usuarios/${usuarioId}/empresas`
    )
    const response = await lastValueFrom(response$)
    return response.data.map((agendaCard: AgendaCardJSON) => AgendaCard.fromJson(agendaCard))
  }

  // ==================== EMPLEADOS ====================

  /**
   * Obtiene todos los empleados de una empresa
   */
  async getAllEmpleados(pageNumber: number): Promise<Usuario[]> {
    const empresaId = this.getEmpresaId()
    const listaItem$ = this.httpClient.get<CustomResponse<UsuarioJSON[]>>(
      `${REST_SERVER_URL}/v1/usuarios/empresa/${empresaId}?page=${pageNumber}`
    )
    const response = await lastValueFrom(listaItem$)
    return response.data.map((usuario: UsuarioJSON) => Usuario.fromJson(usuario))
  }

  /**
   * Obtiene la cantidad total de empleados
   */
  async getCantidadEmpleados(): Promise<number> {
    const empresaId = this.getEmpresaId()
    const cant$ = this.httpClient.get<CustomResponse<number>>(
      `${REST_SERVER_URL}/v1/usuarios/empresa/${empresaId}/cantidad`
    )
    const response = await lastValueFrom(cant$)
    this.cantidadUsuarios = response.data
    return this.cantidadUsuarios
  }

  /**
   * Obtiene empleados filtrados por búsqueda
   */
  async getEmpleadosFiltrados(pageNumber: number, buscar: string): Promise<Usuario[]> {
    const empresaId = this.getEmpresaId()
    const listaItem$ = this.httpClient.get<CustomResponse<UsuarioJSON[]>>(
      `${REST_SERVER_URL}/v1/usuarios/empresa/${empresaId}/buscar/${buscar}?page=${pageNumber}`
    )
    const response = await lastValueFrom(listaItem$)
    return response.data.map((usuario: UsuarioJSON) => Usuario.fromJson(usuario))
  }

  /**
   * Obtiene la cantidad de empleados filtrados
   */
  async getCantidadEmpleadosFiltrados(buscar: string): Promise<number> {
    const empresaId = this.getEmpresaId()
    const cant$ = this.httpClient.get<CustomResponse<number>>(
      `${REST_SERVER_URL}/v1/usuarios/empresa/${empresaId}/buscar/${buscar}/cantidad`
    )
    const response = await lastValueFrom(cant$)
    return response.data
  }

  // ==================== CLIENTES ====================

  /**
   * Obtiene todos los clientes de una empresa
   */
  async getAllClientes(pageNumber: number): Promise<Usuario[]> {
    const empresaId = this.getEmpresaId()
    const listaItem$ = this.httpClient.get<CustomResponse<UsuarioJSON[]>>(
      `${REST_SERVER_URL}/v1/usuarios/empresa/${empresaId}/clientes?page=${pageNumber}`
    )
    const response = await lastValueFrom(listaItem$)
    return response.data.map((usuario: UsuarioJSON) => Usuario.fromJson(usuario))
  }

  /**
   * Obtiene la cantidad total de clientes
   */
  async getCantidadClientes(): Promise<number> {
    const empresaId = this.getEmpresaId()
    const cant$ = this.httpClient.get<CustomResponse<number>>(
      `${REST_SERVER_URL}/v1/usuarios/empresa/${empresaId}/clientes/cantidad`
    )
    const response = await lastValueFrom(cant$)
    this.cantidadUsuarios = response.data
    return this.cantidadUsuarios
  }

  /**
   * Obtiene clientes filtrados por búsqueda
   */
  async getClientesFiltrados(pageNumber: number, buscar: string): Promise<Usuario[]> {
    const empresaId = this.getEmpresaId()
    const listaItem$ = this.httpClient.get<CustomResponse<UsuarioJSON[]>>(
      `${REST_SERVER_URL}/v1/usuarios/empresa/${empresaId}/clientes/buscar/${buscar}?page=${pageNumber}`
    )
    const response = await lastValueFrom(listaItem$)
    return response.data.map((usuario: UsuarioJSON) => Usuario.fromJson(usuario))
  }

  /**
   * Obtiene la cantidad de clientes filtrados
   */
  async getCantidadClientesFiltrados(buscar: string): Promise<number> {
    const empresaId = this.getEmpresaId()
    const cant$ = this.httpClient.get<CustomResponse<number>>(
      `${REST_SERVER_URL}/v1/usuarios/empresa/${empresaId}/clientes/buscar/${buscar}/cantidad`
    )
    const response = await lastValueFrom(cant$)
    return response.data
  }

  // ==================== CRUD ====================

  /**
   * Guarda un usuario (crear o actualizar)
   */
  async save(usuario: Usuario): Promise<Usuario> {
    const empresaId = this.getEmpresaId() || 0
    const usuarioSave = new UsuarioSave(usuario, empresaId, usuario.cargo.toString())
    
    const item$ = this.httpClient.post<CustomResponse<UsuarioJSON>>(
      REST_SERVER_URL + '/v1/usuarios',
      usuarioSave
    )
    const response = await lastValueFrom(item$)

    // Actualizar el username en el almacenamiento si es el usuario logueado
    if (usuario.username) {
      const username = CryptoJsImpl.encryptData(response.data.username)
      localStorage.setItem('session', username)
    }

    return Usuario.fromJson(response.data)
  }

  /**
   * Guarda un cliente
   */
  async saveCliente(cliente: Cliente): Promise<Cliente> {
    const item$ = this.httpClient.post<CustomResponse<Cliente>>(
      REST_SERVER_URL + '/v1/usuarios/clientes',
      cliente
    )
    const response = await lastValueFrom(item$)
    return response.data
  }

  // ==================== ACTUALIZACIONES ====================

  /**
   * Actualiza el cargo de un usuario en una empresa
   */
  async updateCargo(usuario: Usuario): Promise<number> {
    const usuarioEditCargo = new UsuarioEditCargo(
      usuario.id,
      this.getEmpresaId(),
      usuario.cargo
    )
    const item$ = this.httpClient.put<CustomResponse<number>>(
      REST_SERVER_URL + `/v1/usuarios/${usuario.id}/cargo`,
      usuarioEditCargo
    )
    const response = await lastValueFrom(item$)
    return response.data
  }

  /**
   * Actualiza la contraseña de un usuario
   */
  async updatePassword(usuarioId: number, password: string): Promise<Usuario> {
    const usuarioEditPassword = new UsuarioEditPassword(usuarioId, password)
    const item$ = this.httpClient.put<CustomResponse<Usuario>>(
      REST_SERVER_URL + `/v1/usuarios/${usuarioId}/password`,
      usuarioEditPassword
    )
    const response = await lastValueFrom(item$)
    return response.data
  }

  // ==================== ELIMINACIÓN ====================

  /**
   * Elimina el cargo de un usuario en una empresa
   */
  async deleteCargo(usuarioId: number): Promise<any> {
    const empresaId = this.getEmpresaId()
    const response$ = this.httpClient.delete<CustomResponse<any>>(
      REST_SERVER_URL + `/v1/usuarios/${usuarioId}/cargo/${empresaId}`
    )
    const response = await lastValueFrom(response$)
    return response.data
  }

  // ==================== BÚSQUEDAS ====================

  /**
   * Obtiene todos los cargos disponibles
   */
  async getAllCargo(): Promise<Cargo[]> {
    const listaItem$ = this.httpClient.get<CustomResponse<Cargo[]>>(REST_SERVER_URL + '/v1/cargos')
    const response = await lastValueFrom(listaItem$)
    return response.data
  }

  /**
   * Obtiene los eventos de un usuario en una empresa
   */
  async getEventosByUsuarioAndEmpresa(usuarioId: number): Promise<string[]> {
    const listaEvento$ = this.httpClient.put<CustomResponse<string[]>>(
      REST_SERVER_URL + '/v1/eventos/usuario-empresa',
      new UsuarioEmpresa(usuarioId, this.getEmpresaId())
    )
    const response = await lastValueFrom(listaEvento$)
    return response.data
  }

  /**
   * Obtiene la cantidad de eventos de un usuario en una empresa
   */
  async getCantEventosByUsuarioAndEmpresa(usuarioId: number): Promise<number> {
    const cant$ = this.httpClient.put<CustomResponse<number>>(
      REST_SERVER_URL + '/v1/eventos/usuario-empresa/cantidad',
      new UsuarioEmpresa(usuarioId, this.getEmpresaId())
    )
    const response = await lastValueFrom(cant$)
    return response.data
  }

  /**
   * Obtiene todas las empresas de un usuario
   */
  async getAllEmpresas(usuarioId: number): Promise<any[]> {
    const empresas$ = this.httpClient.get<CustomResponse<any[]>>(
      REST_SERVER_URL + `/v1/usuarios/${usuarioId}/empresas`
    )
    const response = await lastValueFrom(empresas$)
    return response.data
  }

  /**
   * Valida si hay una empresa seleccionada en la sesión
   */
  isAgendaSeleccionada(): boolean {
    return 0 != this.getEmpresaId();
  }

  /**
   * Obtiene la información base de un usuario por su ID
   */
  async getUsuario(): Promise<Usuario> {
    const usuario$ = this.httpClient.get<CustomResponse<UsuarioJSON>>(
      '${REST_SERVER_URL}/v1/usuarios/' + this.loginService.getUsuarioId()
    )
    const response = await lastValueFrom(usuario$)
    return Usuario.fromJson(response.data)
  }

  /**
   * Actualiza el cargo de un usuario en una empresa (Ex saveCargo / updateCargo unificados)
   */
  async saveCargo(usuario: Usuario): Promise<number> {
    const usuarioEditCargo = new UsuarioEditCargo(
      usuario.id,
      this.getEmpresaId(),
      usuario.cargo
    )
    
    const item$ = this.httpClient.put<CustomResponse<number>>(
      REST_SERVER_URL + `/v1/usuarios/${usuario.id}/cargo`,
      usuarioEditCargo
    )
    const response = await lastValueFrom(item$)
    return response.data // Retorna el ID del cargo guardado (Long)
  }

  async buscarClientePorEmail(email : string){
    const usuario$ = this.httpClient.get<CustomResponse<Cliente>>(REST_SERVER_URL + '/v1/usuarios/email?email=' + email)
    const response = await lastValueFrom(usuario$)
    return response.data
  }

  async buscarClientePorCelular(celular : number){
    const usuario$ = this.httpClient.get<CustomResponse<Cliente>>(REST_SERVER_URL + '/v1/usuarios/celular?celular='+ celular)
    const response = await lastValueFrom(usuario$)
    return response.data
  }
  
}