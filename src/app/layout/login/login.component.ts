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
      // 1. Esperamos síncronamente a que el login (y la obtención del ID) termine
      await this.loginService.login(this.usuarioLogin)
      
      // 2. Si llegó hasta acá es porque el login fue exitoso (el equivalente al 'complete')
      this.isLoading = false
      this.router.navigateByUrl('/')

    } catch (error) {
      // 3. Si ocurre algún error en la red o las credenciales fallan, salta acá automáticamente
      this.errorLogin.condicional = true
      this.isLoading = false
      
      mostrarErrorConMensaje(this, error)
      
      this.errors.forEach(err => {
        this.errorLogin.mensaje = err
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
