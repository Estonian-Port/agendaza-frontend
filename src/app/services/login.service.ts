import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Router } from '@angular/router'
import { lastValueFrom } from 'rxjs'
import { Usuario, UsuarioEditCargo, UsuarioJSON, UsuarioLoginJSON, UsuarioMe, UsuarioMeJSON } from '../model/Usuario'
import { REST_SERVER_URL } from 'src/util/configuration'
import { CryptoJsImpl } from 'src/util/cryptoJsImpl'
import { Cargo } from '../model/Cargo'
import { CustomResponse } from 'src/util/customResponse'

const BASE_CARGO = `${REST_SERVER_URL}/v1/cargos`

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private static accessToken: string | null = null
  private refreshPromise: Promise<string> | null = null

  constructor(private httpClient: HttpClient, private router: Router) {}

  /**
   * Realiza el login secuencialmente esperando todas las respuestas
   */
  async login(usuarioLoginJson: UsuarioLoginJSON): Promise<void> {
    // 1. Esperamos la respuesta del login básico
    const response = await lastValueFrom(
      this.httpClient.post(REST_SERVER_URL + '/login', usuarioLoginJson, { observe: 'response' })
    )

    const headers = response.headers
    const bearerToken = headers.get('Authorization')
    const refreshToken = headers.get('X-Refresh-Token')
    if (!bearerToken?.startsWith('Bearer ') || !refreshToken) {
      throw new Error('El backend no retornó los tokens de sesión.')
    }

    // Keep the refresh token persistent; the short-lived access token stays in memory.
    const usernameEncrypt = CryptoJsImpl.encryptData(usuarioLoginJson.username)
    localStorage.setItem('session', usernameEncrypt)
    localStorage.setItem('token', refreshToken)
    LoginService.accessToken = bearerToken.slice('Bearer '.length)

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
  async logout(): Promise<void> {
    let refreshToken = this.getRefreshToken()

    try {
      if (refreshToken) {
        if (!this.getToken()) {
          try {
            await this.refreshAccessToken()
            refreshToken = this.getRefreshToken()
          } catch {
            // Still attempt server logout with the current refresh token.
          }
        }

        if (refreshToken) {
          let headers = new HttpHeaders()
          if (this.getToken()) {
            headers = headers.set('Authorization', `Bearer ${this.getToken()}`)
          }
          await lastValueFrom(this.httpClient.post<void>(
            `${REST_SERVER_URL}/v1/auth/logout`,
            { refreshToken },
            { headers }
          ))
        }
      }
    } catch {
      // Local logout must complete even when the server cannot revoke the token.
    } finally {
      this.clearAuthData()
    }
  }

  /**
   * Obtiene el access token en memoria
   */
  getToken(): string | null {
    return LoginService.accessToken
  }

  /**
   * Obtiene el access token en memoria (para uso estático)
   */
  static getToken(): string | null {
    return LoginService.accessToken
  }

  getRefreshToken(): string | null {
    return localStorage.getItem('token')
  }

  hasSession(): boolean {
    return !!this.getRefreshToken()
  }

  refreshAccessToken(): Promise<string> {
    if (this.refreshPromise) return this.refreshPromise

    const refreshToken = this.getRefreshToken()
    if (!refreshToken) return Promise.reject(new Error('No hay una sesión activa.'))

    this.refreshPromise = lastValueFrom(this.httpClient.post<CustomResponse<{
      accessToken: string
      refreshToken: string
    }>>(`${REST_SERVER_URL}/v1/auth/refresh`, { refreshToken })).then(response => {
      const { accessToken, refreshToken: rotatedRefreshToken } = response.data
      if (!accessToken || !rotatedRefreshToken) {
        throw new Error('El backend no retornó los tokens renovados.')
      }

      LoginService.accessToken = accessToken
      localStorage.setItem('token', rotatedRefreshToken)
      return accessToken
    }).catch(error => {
      if (error?.status === 401) {
        this.clearAuthData()
        this.router.navigate(['/login'])
      }
      throw error
    }).finally(() => {
      this.refreshPromise = null
    })

    return this.refreshPromise
  }

  clearAuthData(): void {
    LoginService.accessToken = null
    localStorage.removeItem('token')
    localStorage.removeItem('session')
    localStorage.removeItem('usuarioId')
    localStorage.removeItem('empresa')
    localStorage.removeItem('cargo')
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
    const item$ = this.httpClient.get<CustomResponse<Usuario>>(REST_SERVER_URL + `/v1/usuarios/${usuarioId}/perfil`)
    return (await lastValueFrom(item$)).data
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
  async getCargoByUsuarioAndEmpresa(usuarioId: number): Promise<Cargo> {
    const empresaId = this.getEmpresaId()
    const cargo$ = this.httpClient.get<CustomResponse<Cargo>>(
      `${BASE_CARGO}/${usuarioId}/empresa/${empresaId}`
    )
    return (await lastValueFrom(cargo$)).data
  }

  async getAllCargo(): Promise<Cargo[]> {
    const cargos$ = this.httpClient.get<CustomResponse<Cargo[]>>(`${BASE_CARGO}/tipos`)
    return (await lastValueFrom(cargos$)).data
  }

  async saveCargo(usuario: Usuario): Promise<number> {
    const usuarioEditCargo = new UsuarioEditCargo(
      usuario.id,
      this.getEmpresaId(),
      usuario.cargo
    )
    const cargo$ = this.httpClient.put<CustomResponse<number>>(
      `${BASE_CARGO}/${usuario.id}`,
      usuarioEditCargo
    )
    return (await lastValueFrom(cargo$)).data
  }

  async updateCargo(usuario: Usuario): Promise<number> {
    return this.saveCargo(usuario)
  }

  async deleteCargo(usuarioId: number): Promise<void> {
    const empresaId = this.getEmpresaId()
    await lastValueFrom(
      this.httpClient.delete<CustomResponse<unknown>>(
        `${BASE_CARGO}/${usuarioId}/empresa/${empresaId}`
      )
    )
  }

  private getEmpresaId(): number {
    const empresaIdEncriptada = localStorage.getItem('empresa')
    if (!empresaIdEncriptada) {
      throw new Error('Empresa no seleccionada')
    }
    return CryptoJsImpl.decryptData(empresaIdEncriptada)
  }

  /**
   * Establece el cargo del usuario en localStorage
   */
  async setCargo(): Promise<void> {
    const usuarioId = this.getUsuarioId()
    const cargo = await this.getCargoByUsuarioAndEmpresa(usuarioId)
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
    return this.hasSession()
  }
}
