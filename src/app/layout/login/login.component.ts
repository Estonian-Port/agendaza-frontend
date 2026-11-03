import { Component, EventEmitter, Output } from '@angular/core'
import { Router } from '@angular/router'
import { UsuarioLogin } from 'src/app/model/Usuario'
import { LoginService } from 'src/app/services/login.service'
import { ErrorMensaje } from 'src/util/errorHandler'
import packageInfo from '../../../../package.json'
import { OnboardingStateService } from 'src/app/services/onboarding-state.service'

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

  constructor(
    private loginService: LoginService, 
    private router: Router, 
    private onboardingState: OnboardingStateService
  ) { }

  onSubmit(form: any): void {
    this.ingresar()
  }

  /**
   * Realiza el login
   */
  async ingresar(): Promise<void> {
    this.isLoading = true

    try {
      await this.loginService.login(this.usuarioLogin)
      this.isLoading = false
      
      // Verificar si durante la autenticación / inicio de sesión se marcó onboarding requerido
      if (this.onboardingState.isRequired()) {
        this.router.navigateByUrl('/completar-perfil', { replaceUrl: true })
      } else {
        this.router.navigateByUrl('/')
      }

    } catch (error) {
      this.isLoading = false
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
