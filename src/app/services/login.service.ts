import { HttpClient, HttpResponse } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { lastValueFrom, map } from 'rxjs'
import { Usuario, UsuarioJSON, UsuarioLoginJSON } from '../model/Usuario'
import { REST_SERVER_URL } from 'src/util/configuration'
import { CryptoJsImpl } from 'src/util/cryptoJsImpl'
import { Cargo } from '../model/Cargo'


@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private httpClient: HttpClient) {}

  async login(usuarioLoginJson: UsuarioLoginJSON) {

    const credentials = this.httpClient.post(REST_SERVER_URL + '/login', usuarioLoginJson, {
      observe: 'response'
    }).pipe(map(async (response: HttpResponse<any>) => {
      const headers = response.headers

      const username = CryptoJsImpl.encryptData(usuarioLoginJson.username)
      localStorage.setItem('session', username)

      const bearerToken = headers.get("Authorization")!
      const token = bearerToken.replace('Bearer ', '')

      localStorage.setItem('token', token)
    }))
    return credentials
  }

  logout(){
    localStorage.clear()
  }

  getToken(){
    return localStorage.getItem('token')
  }

  static getToken(){
    return localStorage.getItem('token')
  }

  // No guardar username sino id
  async getUsuarioId() {
    const username = CryptoJsImpl.decryptData(localStorage.getItem('session'))
    const usuario$ = this.httpClient.put<number>(REST_SERVER_URL + '/getUsuarioIdByUsername', username)
    return await lastValueFrom(usuario$)
  }

  async getUsuarioPerfil() {
    const item$ = this.httpClient.get<Usuario>(REST_SERVER_URL + '/getUsuarioPerfil/' + await this.getUsuarioId())
    return await lastValueFrom(item$)
  }

  async getUsuarioLogueado() {
    const usuario$ = this.httpClient.get<UsuarioJSON>(REST_SERVER_URL + '/getUsuarioOfEmpresa/' + await this.getUsuarioId())
    return Usuario.fromJson(await lastValueFrom(usuario$))
  }

  async getCargoByEmpresaAndUsuario(usuarioId : number){
    const cargo$ = this.httpClient.get<Cargo>(REST_SERVER_URL + '/getCargoByEmpresaAndUsuario/' 
      + CryptoJsImpl.decryptData(localStorage.getItem('empresa')) + '/' + usuarioId) 
    return await lastValueFrom(cargo$)
  }

  async setCargo() {
    localStorage.setItem('cargo', CryptoJsImpl.encryptData(await this.getCargoByEmpresaAndUsuario(
      await this.getUsuarioId()
    )))
  }



  getCargo(): Cargo {
    return CryptoJsImpl.decryptData(localStorage.getItem('cargo'))
  }

  isAdmin(): boolean {
    return this.getCargo() == Cargo.ADMIN
  }
  
  isEmpleado(): boolean {
    return this.getCargo() == Cargo.EMPLEADO
  }

}
