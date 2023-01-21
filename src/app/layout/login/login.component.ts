import { Component, EventEmitter, Output } from '@angular/core'
import { Router } from '@angular/router'
import { UsuarioLogin } from 'src/app/model/Usuario'
import { LoginService } from 'src/app/services/login.service'
import { ErrorMensaje, mostrarErrorConMensaje } from 'src/util/errorHandler'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  usuarioLogin : UsuarioLogin = new UsuarioLogin(0, '', '')
  errors = []
  errorUsuario : ErrorMensaje = new ErrorMensaje(false, '')
  errorContrasena :  ErrorMensaje = new ErrorMensaje(false, '')

  @Output () valorLogin = new EventEmitter<boolean>()

  constructor(private loginService: LoginService, private router : Router) {}

  public async ingresar(){

    this.errorContrasena.condicional = false
    this.errorUsuario.condicional = false

    try {
      await this.loginService.getByUsernameAndContrasena(this.usuarioLogin)
      if(this.loginService.isUsuarioLogueado()){
        this.router.navigateByUrl('/buscarItinerarios')
      }else{
        this.errorContrasena.condicional = true
        this.errorContrasena.mensaje = 'Error de contraseña'
      }
    } catch (error) {
      this.errorUsuario.condicional = true
      mostrarErrorConMensaje(this, error)
      this.errors.forEach(error => { this.errorUsuario.mensaje = error })
    }
  }
}
