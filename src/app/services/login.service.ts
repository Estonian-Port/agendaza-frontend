import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { lastValueFrom } from 'rxjs'
import { Usuario, UsuarioJSON, UsuarioLoginJSON } from '../model/Usuario'
import { REST_SERVER_URL } from 'src/util/configuration'


@Injectable({
  providedIn: 'root'
})
export class LoginService {
  logOut() {
    this.idUsuarioLogueado = undefined
  }

  constructor(private httpClient: HttpClient) {}

  idUsuarioLogueado! : number | undefined


  public getIdUsuarioLogueado() : number | undefined {
    return this.idUsuarioLogueado
  }

  isUsuarioLogueado(){
    return !!this.idUsuarioLogueado
  }

  async getByUsernameAndContrasena(usuarioLoginJson: UsuarioLoginJSON) {
    const usuario$ = this.httpClient.put<number>(REST_SERVER_URL + '/getUsuarioByUsernameAndContrasena', usuarioLoginJson)
    this.idUsuarioLogueado = await lastValueFrom(usuario$)
  }

  async getUsuarioLogueado() {
    const usuario$ = this.httpClient.get<UsuarioJSON>(REST_SERVER_URL + '/getUsuario/' + this.getIdUsuarioLogueado())
    return Usuario.fromJson(await lastValueFrom(usuario$))
  }
}
