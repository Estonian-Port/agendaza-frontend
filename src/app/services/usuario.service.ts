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
import { AgendaService } from './agenda.service'
import { LoginService } from './login.service'
import { Cargo } from '../model/Cargo'
import { CryptoJsImpl } from 'src/util/cryptoJsImpl'

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  cantidadUsuarios: number = 0
  perfilVolver: String = ""

  constructor(
    private httpClient: HttpClient,
    private agendaService: AgendaService,
    private loginService: LoginService
  ) { }

  // ==================== EMPLEADOS ====================

  /**
   * Obtiene todos los empleados de una empresa
   */
  async getAllEmpleados(pageNumber: number): Promise<Usuario[]> {
    const empresaId = this.agendaService.getEmpresaId()
    const listaItem$ = this.httpClient.get<UsuarioJSON[]>(
      `${REST_SERVER_URL}/v1/usuarios/empresa/${empresaId}?page=${pageNumber}`
    )
    const listaItem = await lastValueFrom(listaItem$)
    return listaItem.map((usuario) => Usuario.fromJson(usuario))
  }

  /**
   * Obtiene la cantidad total de empleados
   */
  async getCantidadEmpleados(): Promise<number> {
    const empresaId = this.agendaService.getEmpresaId()
    const cant$ = this.httpClient.get<number>(
      `${REST_SERVER_URL}/v1/usuarios/empresa/${empresaId}/cantidad`
    )
    this.cantidadUsuarios = await lastValueFrom(cant$)
    return this.cantidadUsuarios
  }

  /**
   * Obtiene empleados filtrados por búsqueda
   */
  async getEmpleadosFiltrados(pageNumber: number, buscar: string): Promise<Usuario[]> {
    const empresaId = this.agendaService.getEmpresaId()
    const listaItem$ = this.httpClient.get<UsuarioJSON[]>(
      `${REST_SERVER_URL}/v1/usuarios/empresa/${empresaId}/buscar/${buscar}?page=${pageNumber}`
    )
    const listaItem = await lastValueFrom(listaItem$)
    return listaItem.map((usuario) => Usuario.fromJson(usuario))
  }

  /**
   * Obtiene la cantidad de empleados filtrados
   */
  async getCantidadEmpleadosFiltrados(buscar: string): Promise<number> {
    const empresaId = this.agendaService.getEmpresaId()
    const cant$ = this.httpClient.get<number>(
      `${REST_SERVER_URL}/v1/usuarios/empresa/${empresaId}/buscar/${buscar}/cantidad`
    )
    return await lastValueFrom(cant$)
  }

  // ==================== CLIENTES ====================

  /**
   * Obtiene todos los clientes de una empresa
   */
  async getAllClientes(pageNumber: number): Promise<Usuario[]> {
    const empresaId = this.agendaService.getEmpresaId()
    const listaItem$ = this.httpClient.get<UsuarioJSON[]>(
      `${REST_SERVER_URL}/v1/usuarios/empresa/${empresaId}/clientes?page=${pageNumber}`
    )
    const listaItem = await lastValueFrom(listaItem$)
    return listaItem.map((usuario) => Usuario.fromJson(usuario))
  }

  /**
   * Obtiene la cantidad total de clientes
   */
  async getCantidadClientes(): Promise<number> {
    const empresaId = this.agendaService.getEmpresaId()
    const cant$ = this.httpClient.get<number>(
      `${REST_SERVER_URL}/v1/usuarios/empresa/${empresaId}/clientes/cantidad`
    )
    this.cantidadUsuarios = await lastValueFrom(cant$)
    return this.cantidadUsuarios
  }

  /**
   * Obtiene clientes filtrados por búsqueda
   */
  async getClientesFiltrados(pageNumber: number, buscar: string): Promise<Usuario[]> {
    const empresaId = this.agendaService.getEmpresaId()
    const listaItem$ = this.httpClient.get<UsuarioJSON[]>(
      `${REST_SERVER_URL}/v1/usuarios/empresa/${empresaId}/clientes/buscar/${buscar}?page=${pageNumber}`
    )
    const listaItem = await lastValueFrom(listaItem$)
    return listaItem.map((usuario) => Usuario.fromJson(usuario))
  }

  /**
   * Obtiene la cantidad de clientes filtrados
   */
  async getCantidadClientesFiltrados(buscar: string): Promise<number> {
    const empresaId = this.agendaService.getEmpresaId()
    const cant$ = this.httpClient.get<number>(
      `${REST_SERVER_URL}/v1/usuarios/empresa/${empresaId}/clientes/buscar/${buscar}/cantidad`
    )
    return await lastValueFrom(cant$)
  }

  // ==================== CRUD ====================

  /**
   * Guarda un usuario (crear o actualizar)
   */
  async save(usuario: Usuario): Promise<Usuario> {
    const empresaId = this.agendaService.getEmpresaId() || 0
    const usuarioSave = new UsuarioSave(usuario, empresaId, usuario.cargo.toString())
    
    const item$ = this.httpClient.post<UsuarioJSON>(
      REST_SERVER_URL + '/v1/usuarios',
      usuarioSave
    )
    const item = await lastValueFrom(item$)

    // Actualizar el username en el almacenamiento si es el usuario logueado
    if (usuario.username) {
      const username = CryptoJsImpl.encryptData(item.username)
      localStorage.setItem('session', username)
    }

    return Usuario.fromJson(item)
  }

  /**
   * Guarda un cliente
   */
  async saveCliente(cliente: Cliente): Promise<Cliente> {
    const item$ = this.httpClient.post<Cliente>(
      REST_SERVER_URL + '/v1/usuarios/clientes',
      cliente
    )
    return await lastValueFrom(item$)
  }

  // ==================== ACTUALIZACIONES ====================

  /**
   * Actualiza el cargo de un usuario en una empresa
   */
  async updateCargo(usuario: Usuario): Promise<number> {
    const usuarioEditCargo = new UsuarioEditCargo(
      usuario.id,
      this.agendaService.getEmpresaId(),
      usuario.cargo
    )
    const item$ = this.httpClient.put<number>(
      REST_SERVER_URL + `/v1/usuarios/${usuario.id}/cargo`,
      usuarioEditCargo
    )
    return await lastValueFrom(item$)
  }

  /**
   * Actualiza la contraseña de un usuario
   */
  async updatePassword(usuarioId: number, password: string): Promise<Usuario> {
    const usuarioEditPassword = new UsuarioEditPassword(usuarioId, password)
    const item$ = this.httpClient.put<Usuario>(
      REST_SERVER_URL + `/v1/usuarios/${usuarioId}/password`,
      usuarioEditPassword
    )
    return await lastValueFrom(item$)
  }

  // ==================== ELIMINACIÓN ====================

  /**
   * Elimina el cargo de un usuario en una empresa
   */
  async deleteCargo(usuarioId: number): Promise<any> {
    const empresaId = this.agendaService.getEmpresaId()
    return this.httpClient.delete<any>(
      REST_SERVER_URL + `/v1/usuarios/${usuarioId}/cargo/${empresaId}`
    )
  }

  // ==================== BÚSQUEDAS ====================

  /**
   * Obtiene todos los cargos disponibles
   */
  async getAllCargo(): Promise<Cargo[]> {
    const listaItem$ = this.httpClient.get<Cargo[]>(REST_SERVER_URL + '/v1/cargos')
    return await lastValueFrom(listaItem$)
  }

  /**
   * Obtiene los eventos de un usuario en una empresa
   */
  async getEventosByUsuarioAndEmpresa(usuarioId: number): Promise<string[]> {
    const listaEvento$ = this.httpClient.put<string[]>(
      REST_SERVER_URL + '/v1/eventos/usuario-empresa',
      new UsuarioEmpresa(usuarioId, this.agendaService.getEmpresaId())
    )
    return await lastValueFrom(listaEvento$)
  }

  /**
   * Obtiene la cantidad de eventos de un usuario en una empresa
   */
  async getCantEventosByUsuarioAndEmpresa(usuarioId: number): Promise<number> {
    const cant$ = this.httpClient.put<number>(
      REST_SERVER_URL + '/v1/eventos/usuario-empresa/cantidad',
      new UsuarioEmpresa(usuarioId, this.agendaService.getEmpresaId())
    )
    return await lastValueFrom(cant$)
  }

  /**
   * Obtiene todas las empresas de un usuario
   */
  async getAllEmpresas(usuarioId: number): Promise<any[]> {
    const empresas$ = this.httpClient.get<any[]>(
      REST_SERVER_URL + `/v1/usuarios/${usuarioId}/empresas`
    )
    return await lastValueFrom(empresas$)
  }
}
