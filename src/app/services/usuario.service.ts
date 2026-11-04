import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { lastValueFrom } from 'rxjs'
import { REST_SERVER_URL } from 'src/util/configuration'
import {
  Cliente,
  Usuario,
  UsuarioEditPassword,
  UsuarioJSON,
  UsuarioSave,
} from '../model/Usuario'
import { CryptoJsImpl } from 'src/util/cryptoJsImpl'
import { AgendaCard, AgendaCardJSON } from '../model/Agenda'
import { CustomResponse } from 'src/util/customResponse'
import { EventosUsuarioResponse } from '../model/Evento'
import { ToastService } from './toast.service'
import { Observable } from 'rxjs'

const BASE = `${REST_SERVER_URL}/v1/usuarios`

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  constructor(
    private httpClient: HttpClient,
    private toastService: ToastService
  ) { }

  checkUsername(username: string): Observable<unknown> {
    return this.httpClient.get<unknown>(
      `${BASE}/check-username`,
      { params: { username } }
    )
  }

  completeOnboarding(payload: {
    nombre: string
    apellido: string
    celular: string
    fechaNacimiento: string
    username: string
    email: string
    password: string
    aceptoTerminos: boolean
    versionTerminos: string
  }): Promise<void> {
    return lastValueFrom(
      this.httpClient.put<void>(`${BASE}/me/completar-datos`, payload)
    )
  }

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
      `${BASE}/${usuarioId}/empresas`
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
      `${BASE}/empresa/${empresaId}?page=${pageNumber}`
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
      `${BASE}/empresa/${empresaId}/cantidad`
    )
    const response = await lastValueFrom(cant$)
    return response.data
  }

  /**
   * Obtiene empleados filtrados por búsqueda
   */
  async getEmpleadosFiltrados(pageNumber: number, buscar: string): Promise<Usuario[]> {
    const empresaId = this.getEmpresaId()
    const listaItem$ = this.httpClient.get<CustomResponse<UsuarioJSON[]>>(
      `${BASE}/empresa/${empresaId}/buscar/${buscar}?page=${pageNumber}`
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
      `${BASE}/empresa/${empresaId}/buscar/${buscar}/cantidad`
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
      `${BASE}/empresa/${empresaId}/clientes?page=${pageNumber}`
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
      `${BASE}/empresa/${empresaId}/clientes/cantidad`
    )
    const response = await lastValueFrom(cant$)
    return response.data
  }

  /**
   * Obtiene clientes filtrados por búsqueda
   */
  async getClientesFiltrados(pageNumber: number, buscar: string): Promise<Usuario[]> {
    const empresaId = this.getEmpresaId()
    const listaItem$ = this.httpClient.get<CustomResponse<UsuarioJSON[]>>(
      `${BASE}/empresa/${empresaId}/clientes/buscar/${buscar}?page=${pageNumber}`
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
      `${BASE}/empresa/${empresaId}/clientes/buscar/${buscar}/cantidad`
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
      BASE,
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
      `${BASE}/clientes`,
      cliente
    )
    const response = await lastValueFrom(item$)
    this.toastService.showSuccess(response.message || 'Cliente guardado correctamente')
    return response.data
  }

  // ==================== ACTUALIZACIONES ====================

  /**
   * Actualiza la contraseña de un usuario
   */
  async updatePassword(usuarioId: number, password: string): Promise<Usuario> {
    const usuarioEditPassword = new UsuarioEditPassword(usuarioId, password)
    const item$ = this.httpClient.put<CustomResponse<Usuario>>(
      `${BASE}/${usuarioId}/password`,
      usuarioEditPassword
    )
    const response = await lastValueFrom(item$)
    return response.data
  }

  // ==================== ELIMINACIÓN ====================

  // ==================== BÚSQUEDAS ====================

  /**
   * Obtiene los eventos y la cantidad de un usuario en una empresa
   */
  async getEventosByUsuarioAndEmpresa(usuarioId: number, empresaId: number): Promise<EventosUsuarioResponse> {
    // Cambiamos a GET y eliminamos el body (new UsuarioEmpresa)
    const url = REST_SERVER_URL + `/v1/eventos/usuario/${usuarioId}/empresa/${empresaId}`
    const peticion$ = this.httpClient.get<CustomResponse<EventosUsuarioResponse>>(url)
    const response = await lastValueFrom(peticion$);
    
    // Devolvemos la data entera, que ahora trae tanto el array como el número
    return response.data;
  }

  /**
   * Obtiene todas las empresas de un usuario
   */
  async getAllEmpresas(usuarioId: number): Promise<any[]> {
    const empresas$ = this.httpClient.get<CustomResponse<any[]>>(
      `${BASE}/${usuarioId}/empresas`
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
  async getUsuario(id: number): Promise<Usuario> {
    const usuario$ = this.httpClient.get<CustomResponse<UsuarioJSON>>(
      `${BASE}/${id}`
    )
    const response = await lastValueFrom(usuario$)
    return Usuario.fromJson(response.data)
  }

  async buscarClientePorEmail(email : string){
    const usuario$ = this.httpClient.get<CustomResponse<Cliente>>(`${BASE}/email?email=${email}`)
    const response = await lastValueFrom(usuario$)
    return response.data
  }

  async buscarClientePorCelular(celular : number){
    const usuario$ = this.httpClient.get<CustomResponse<Cliente>>(`${BASE}/celular?celular=${celular}`)
    const response = await lastValueFrom(usuario$)
    this.toastService.showSuccess(response.message || 'Cliente encontrado')
    return response.data
  }

}