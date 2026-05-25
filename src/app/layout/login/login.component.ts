import { Component, EventEmitter, Output } from '@angular/core'
import { Router } from '@angular/router'
import { UsuarioLogin } from 'src/app/model/Usuario'
import { LoginService } from 'src/app/services/login.service'
import { ErrorMensaje, mostrarErrorConMensaje } from 'src/util/errorHandler'
import packageInfo from '../../../../package.json'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  usuarioLogin: UsuarioLogin = new UsuarioLogin('', '')
  errors: string[] = []
  errorLogin: ErrorMensaje = new ErrorMensaje(false, '')
  showPassword: boolean = false
  appVersion: string = packageInfo.version
  isLoading: boolean = false

  @Output() valorLogin = new EventEmitter<boolean>()

  constructor(private loginService: LoginService, private router: Router) { }

  onSubmit(form: any): void {
    this.ingresar()
  }

  /**
   * Realiza el login
   */
  async ingresar(): Promise<void> {
    this.errorLogin.condicional = false
    this.errors = []
    this.isLoading = true

    try {
      (await this.loginService.login(this.usuarioLogin)).subscribe({
        error: (err: any) => {
          this.errorLogin.condicional = true
          this.isLoading = false
          mostrarErrorConMensaje(this, err)
          this.errors.forEach(error => {
            this.errorLogin.mensaje = error
          })
        },
        complete: () => {
          this.isLoading = false
          this.router.navigateByUrl('/')
        }
      })
    } catch (error) {
      this.errorLogin.condicional = true
      this.isLoading = false
      mostrarErrorConMensaje(this, error)
      this.errors.forEach(error => {
        this.errorLogin.mensaje = error
      })
    }
  }

  /**
   * Verifica si el usuario está autenticado
   */
  isLogueado(): boolean {
    return this.loginService.isLogueado()
  }

  /**
   * Alterna la visibilidad de la contraseña
   */
  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword
  }
}
