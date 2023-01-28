import { HttpClient, HttpResponse } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { lastValueFrom, map } from 'rxjs'
import { Usuario, UsuarioJSON, UsuarioLoginJSON } from '../model/Usuario'
import { REST_SERVER_URL } from 'src/util/configuration'


@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private httpClient: HttpClient) {}

  async login(usuarioLoginJson: UsuarioLoginJSON) {
    const credentials = this.httpClient.post(REST_SERVER_URL + '/login', usuarioLoginJson, {
      observe: 'response'
    }).pipe(map((response: HttpResponse<any>) => {
      const body = response.body
      const headers = response.headers

      const bearerToken = headers.get("Authorization")!
      const token = bearerToken.replace('Bearer ', '')

      localStorage.setItem('token', token)
      return body    
    }))
    
    this.getUsuarioIdByUsername(usuarioLoginJson)
    
    return credentials
    
  }

  getToken(){
    return localStorage.getItem('token')
  }

  async getUsuarioIdByUsername(usuarioLoginJson: UsuarioLoginJSON) {
    const usuario$ = this.httpClient.put<number>(REST_SERVER_URL + '/getUsuarioIdByUsername', usuarioLoginJson)
    const idUsuarioLogueado = await lastValueFrom(usuario$)
    localStorage.setItem('idUsuarioLogueado', idUsuarioLogueado.toLocaleString())

  }

  getIdUsuarioLogueado(){
    return Number(localStorage.getItem('idUsuarioLogueado'))
  }

  async getUsuarioLogueado() {
    const usuario$ = this.httpClient.get<UsuarioJSON>(REST_SERVER_URL + '/getUsuario/' + this.getIdUsuarioLogueado())
    return Usuario.fromJson(await lastValueFrom(usuario$))
  }
}
