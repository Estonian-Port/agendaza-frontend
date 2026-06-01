import { HttpClient, HttpResponse } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { lastValueFrom, map } from 'rxjs'
import { Usuario, UsuarioJSON, UsuarioLoginJSON, UsuarioMe, UsuarioMeJSON } from '../model/Usuario'
import { REST_SERVER_URL } from 'src/util/configuration'
import { CryptoJsImpl } from 'src/util/cryptoJsImpl'
import { Cargo } from '../model/Cargo'
import { CustomResponse } from 'src/util/customResponse'

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private httpClient: HttpClient) {}

  /**
   * Realiza el login secuencialmente esperando todas las respuestas
   */
  async login(usuarioLoginJson: UsuarioLoginJSON): Promise<void> {
    // 1. Esperamos la respuesta del login básico
    const response = await lastValueFrom(
      this.httpClient.post(REST_SERVER_URL + '/login', usuarioLoginJson, { observe: 'response' })
    )

    const headers = response.headers

    // 2. Guardamos sesión y token de forma inmediata
    const usernameEncrypt = CryptoJsImpl.encryptData(usuarioLoginJson.username)
    localStorage.setItem('session', usernameEncrypt)

    const bearerToken = headers.get("Authorization")!
    const token = bearerToken.replace('Bearer ', '')
    localStorage.setItem('token', token)

    // 3. AHORA SÍ: Esperamos a que el DTO del usuario realmente llegue antes de avanzar
    const usuario = await this.getUsuarioDtoByUsername()
    
    // Verificación de resguardo para que no guarde un "undefined" en string
    if (!usuario || !usuario.id) {
      throw new Error('El backend no retornó un ID de usuario válido.')
    }

    const usuarioIdEncrypt = CryptoJsImpl.encryptData(usuario.id)
    localStorage.setItem('usuarioId', usuarioIdEncrypt)
  }

  /**
   * Obtiene los datos del usuario logueado manejando la propiedad 'data' del backend
   */
  async getUsuarioDtoByUsername(): Promise<UsuarioMe> {
    const usuarioJson$ = this.httpClient.get<any>(`${REST_SERVER_URL}/v1/usuarios/me`)
    const res = await lastValueFrom(usuarioJson$)
    
    // Como tu backend devuelve { message: '...', data: { id: 141, ... } }
    // tenemos que pasarle el objeto 'data' a tu conversor de modelo.
    const datosUsuario = res.data ? res.data : res; 
    
    return UsuarioMe.fromJson(datosUsuario)
  }
  /**
   * Limpia el almacenamiento local
   */
  logout(): void {
    localStorage.clear()
  }

  /**
   * Obtiene el token JWT del almacenamiento
   */
  getToken(): string | null {
    return localStorage.getItem('token')
  }

  /**
   * Obtiene el token JWT estáticamente (para uso en interceptores)
   */
  static getToken(): string | null {
    return localStorage.getItem('token')
  }

  /**
   * Obtiene el ID del usuario logueado (desencriptado)
   */
  getUsuarioId(): number {
    const usuarioIdEncriptado = localStorage.getItem('usuarioId')
    if (!usuarioIdEncriptado) {
      throw new Error('Usuario no autenticado')
    }
    return parseInt(CryptoJsImpl.decryptData(usuarioIdEncriptado), 10)
  }

  /**
   * Obtiene el username del usuario logueado (desencriptado)
   */
  getUsername(): string {
    const sessionEncriptada = localStorage.getItem('session')
    if (!sessionEncriptada) {
      throw new Error('Usuario no autenticado')
    }
    return CryptoJsImpl.decryptData(sessionEncriptada)
  }

  /**
   * Obtiene el perfil del usuario logueado
   */
  async getUsuarioPerfil() {
    const usuarioId = this.getUsuarioId()
    const item$ = this.httpClient.get<Usuario>(REST_SERVER_URL + `/v1/usuarios/${usuarioId}/perfil/me`)
    return await lastValueFrom(item$)
  }

  /**
   * Obtiene el usuario logueado con todos sus datos
   */
  async getUsuarioLogueado(): Promise<Usuario> {
    const usuarioId = this.getUsuarioId()
    const usuario$ = this.httpClient.get<UsuarioJSON>(REST_SERVER_URL + `/v1/usuarios/${usuarioId}`)
    return Usuario.fromJson(await lastValueFrom(usuario$))
  }

  /**
   * Obtiene el cargo del usuario en una empresa específica
   */
  async getCargoByEmpresaAndUsuario(usuarioId: number): Promise<Cargo> {
    const empresaIdEncriptada = localStorage.getItem('empresa')
    if (!empresaIdEncriptada) {
      throw new Error('Empresa no seleccionada')
    }
    const empresaId = CryptoJsImpl.decryptData(empresaIdEncriptada)
    const cargo$ = this.httpClient.get<CustomResponse<Cargo>>(
      REST_SERVER_URL + `/v1/cargos/${usuarioId}/empresa/${empresaId}`
    )
    return (await lastValueFrom(cargo$)).data
  }

  /**
   * Establece el cargo del usuario en localStorage
   */
  async setCargo(): Promise<void> {
    const usuarioId = this.getUsuarioId()
    const cargo = await this.getCargoByEmpresaAndUsuario(usuarioId)
    localStorage.setItem('cargo', CryptoJsImpl.encryptData(cargo))
  }

  /**
   * Obtiene el cargo del usuario desde localStorage
   */
  getCargo(): Cargo {
    const cargoEncriptado = localStorage.getItem('cargo')
    if (!cargoEncriptado) {
      throw new Error('Cargo no establecido')
    }
    return CryptoJsImpl.decryptData(cargoEncriptado)
  }

  /**
   * Verifica si el usuario es admin
   */
  isAdmin(): boolean {
    try {
      return this.getCargo() == Cargo.ADMIN
    } catch {
      return false
    }
  }

  /**
   * Verifica si el usuario es empleado
   */
  isEmpleado(): boolean {
    try {
      return this.getCargo() == Cargo.EMPLEADO
    } catch {
      return false
    }
  }

  /**
   * Verifica si el usuario está autenticado
   */
  isLogueado(): boolean {
    return this.getToken() != null && this.getToken() != ""
  }
}
