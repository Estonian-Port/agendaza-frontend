import { HttpClient, HttpResponse } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { lastValueFrom, map } from 'rxjs'
import { Usuario, UsuarioJSON, UsuarioLoginJSON, UsuarioMe, UsuarioMeJSON } from '../model/Usuario'
import { REST_SERVER_URL } from 'src/util/configuration'
import { CryptoJsImpl } from 'src/util/cryptoJsImpl'
import { Cargo } from '../model/Cargo'

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private httpClient: HttpClient) {}

  /**
   * Realiza el login y almacena el token y datos del usuario
   */
  async login(usuarioLoginJson: UsuarioLoginJSON) {
    const credentials = this.httpClient.post(REST_SERVER_URL + '/login', usuarioLoginJson, {
      observe: 'response'
    }).pipe(
      map(async (response: HttpResponse<any>) => {
        const headers = response.headers

        // Encriptar y guardar username
        const username = CryptoJsImpl.encryptData(usuarioLoginJson.username)
        localStorage.setItem('session', username)

        // Obtener y guardar token JWT
        const bearerToken = headers.get("Authorization")!
        const token = bearerToken.replace('Bearer ', '')
        localStorage.setItem('token', token)

        // Obtener datos del usuario logueado y guardar su ID
        const usuario = await this.getUsuarioDtoByEmail()
        const usuarioId = CryptoJsImpl.encryptData(usuario.id.toString())
        localStorage.setItem('usuarioId', usuarioId)
      })
    )
    return credentials
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
   * Obtiene los datos del usuario logueado desde el backend
   */
  async getUsuarioDtoByEmail(): Promise<UsuarioMe> {
    const usuarioJson$ = this.httpClient.get<UsuarioMeJSON>(`${REST_SERVER_URL}/v1/usuarios/me`)
    return UsuarioMe.fromJson(await lastValueFrom(usuarioJson$))
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
    const cargo$ = this.httpClient.get<Cargo>(
      REST_SERVER_URL + `/v1/usuarios/${usuarioId}/cargo/${empresaId}`
    )
    return await lastValueFrom(cargo$)
  }

  /**
   * Establece el cargo del usuario en localStorage
   */
  async setCargo(): Promise<void> {
    const usuarioId = this.getUsuarioId()
    const cargo = await this.getCargoByEmpresaAndUsuario(usuarioId)
    localStorage.setItem('cargo', CryptoJsImpl.encryptData(cargo.toString()))
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
