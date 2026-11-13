import { Component, OnDestroy, OnInit } from '@angular/core'
import { FormBuilder, Validators } from '@angular/forms'
import { Router } from '@angular/router'
import { OnboardingStateService } from 'src/app/services/onboarding-state.service'
import { UsuarioService } from 'src/app/services/usuario.service'

@Component({
  selector: 'app-verificar-email',
  templateUrl: './verificar-email.component.html'
})
export class VerificarEmailComponent implements OnDestroy, OnInit {
  form = this.formBuilder.group({
    codigo: ['', Validators.required]
  })
  enviando = false
  reenviando = false
  solicitandoInicial = false
  segundosParaReenviar = 0
  error = ''
  mensaje = ''
  private intervaloReenvio: ReturnType<typeof setInterval> | null = null
  private readonly tiempoEsperaReenvio = 60

  constructor(
    private formBuilder: FormBuilder,
    private usuarioService: UsuarioService,
    private onboardingState: OnboardingStateService,
    private router: Router
  ) { }

  ngOnInit(): void {
    void this.solicitarCodigoInicial()
  }

  ngOnDestroy(): void {
    this.limpiarIntervaloReenvio()
  }

  private async solicitarCodigoInicial(): Promise<void> {
    this.solicitandoInicial = true
    this.error = ''
    this.mensaje = ''
    try {
      await this.usuarioService.requestEmailVerification()
      this.mensaje = 'Verificá tu email. Te enviamos un código a tu dirección.'
      this.iniciarCuentaRegresiva()
    } catch (error: any) {
      const backendError = error?.error
      this.error = typeof backendError === 'string'
        ? backendError
        : backendError?.message || backendError?.error || backendError?.mensaje || 'No se pudo enviar el código de verificación.'
    } finally {
      this.solicitandoInicial = false
    }
  }

  async confirmar(): Promise<void> {
    this.form.markAllAsTouched()
    if (this.form.invalid || this.enviando || this.solicitandoInicial) return

    this.enviando = true
    this.error = ''
    this.mensaje = ''
    try {
      await this.usuarioService.confirmEmailVerification(this.form.controls.codigo.value || '')
      this.onboardingState.setStatus(await this.usuarioService.getEstado())
      const requiredRoute = this.onboardingState.getRequiredRoute()
      if (requiredRoute === '/verificar-email') {
        this.error = 'El correo todavía requiere verificación. Comprueba el código e intenta nuevamente.'
      } else {
        await this.router.navigateByUrl(requiredRoute || '/', { replaceUrl: true })
      }
    } catch (error: any) {
      const backendError = error?.error
      this.error = typeof backendError === 'string'
        ? backendError
        : backendError?.message || backendError?.error || backendError?.mensaje || 'No se pudo verificar el correo.'
    } finally {
      this.enviando = false
    }
  }

  async reenviarCodigo(): Promise<void> {
    if (this.reenviando || this.solicitandoInicial || this.segundosParaReenviar > 0) return

    this.reenviando = true
    this.error = ''
    this.mensaje = ''
    try {
      await this.usuarioService.requestEmailVerification()
      this.mensaje = 'Enviamos un nuevo código a tu correo.'
      this.iniciarCuentaRegresiva()
    } catch (error: any) {
      const backendError = error?.error
      this.error = typeof backendError === 'string'
        ? backendError
        : backendError?.message || backendError?.error || backendError?.mensaje || 'No se pudo reenviar el código.'
    } finally {
      this.reenviando = false
    }
  }

  private iniciarCuentaRegresiva(): void {
    this.limpiarIntervaloReenvio()
    this.segundosParaReenviar = this.tiempoEsperaReenvio
    this.intervaloReenvio = setInterval(() => {
      this.segundosParaReenviar -= 1
      if (this.segundosParaReenviar <= 0) {
        this.segundosParaReenviar = 0
        this.limpiarIntervaloReenvio()
      }
    }, 1000)
  }

  private limpiarIntervaloReenvio(): void {
    if (this.intervaloReenvio !== null) {
      clearInterval(this.intervaloReenvio)
      this.intervaloReenvio = null
    }
  }
}