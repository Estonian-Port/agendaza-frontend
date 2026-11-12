import { Component, EventEmitter, Output } from '@angular/core'
import { Router } from '@angular/router'
import { UsuarioLogin } from 'src/app/model/Usuario'
import { LoginService } from 'src/app/services/login.service'
import { ErrorMensaje } from 'src/util/errorHandler'
import packageInfo from '../../../../package.json'
import { OnboardingStateService } from 'src/app/services/onboarding-state.service'
import { UsuarioService } from 'src/app/services/usuario.service'
import { AgendaCard } from 'src/app/model/Agenda'

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
    private onboardingState: OnboardingStateService,
    private usuarioService: UsuarioService
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
      this.onboardingState.setStatus(await this.usuarioService.getEstado())

      let destination = '/'
      let navigationState: { agendas: AgendaCard[] } | undefined

      // Verificar si durante la autenticación / inicio de sesión se marcó onboarding requerido
      if (this.onboardingState.isRequired()) {
        destination = '/completar-perfil'
      } else if (this.onboardingState.isPasswordChangeRequired()) {
        destination = '/cambiar-password'
      } else {
        const usuarioId = this.loginService.getUsuarioId()
        const agendas = await this.usuarioService.getAllEmpresaByUsuarioId(usuarioId)

        if (agendas.length === 1) {
          this.usuarioService.setEmpresaId(agendas[0].id)
          await this.loginService.setCargo()
          destination = '/agenda'
        } else {
          navigationState = { agendas }
        }
      }

      await this.router.navigateByUrl(destination, { replaceUrl: true, state: navigationState })
      this.isLoading = false

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
