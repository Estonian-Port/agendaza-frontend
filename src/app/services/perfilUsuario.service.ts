import { Usuario, UsuarioJSON, PerfilDeUsuarioJSON, PerfilUsuario } from './../model/Usuario';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { LoginService } from './login.service';
import { REST_SERVER_URL } from 'src/util/configuration';

@Injectable({
  providedIn: 'root'
})
export class PerfilUsuarioService {

  constructor(private http: HttpClient , public loginService : LoginService ){}

  async obtenerUsuarioPorId() {
    const usuarioJson$ = this.http.get<UsuarioJSON>(REST_SERVER_URL + "/getUsuario/"+this.loginService.idUsuarioLogueado)
    const usuarioJson = await lastValueFrom(usuarioJson$)
    return   usuarioJson ? Usuario.fromJson(usuarioJson) : undefined
  }

  async obtenerElPerfilDeUSuario() {
    const perfilUsuario$ = this.http.get<PerfilDeUsuarioJSON>(REST_SERVER_URL + "/getPerfilDeUsuario/"+this.loginService.idUsuarioLogueado)
    const perfilUsuario = await lastValueFrom(perfilUsuario$)
    return   perfilUsuario ? PerfilUsuario.fromJson(perfilUsuario) : undefined
  }

  async actualizarPerfilDeUsuario(perfilUsuario : PerfilUsuario){
    const perfilUsuario$ = this.http.put<PerfilDeUsuarioJSON>(REST_SERVER_URL + "/actualizarAlUsuario/"+this.loginService.idUsuarioLogueado, perfilUsuario.toJSON())
    return await lastValueFrom(perfilUsuario$ )
  }


}
