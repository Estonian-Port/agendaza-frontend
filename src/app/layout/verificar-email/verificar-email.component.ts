import { Component, OnDestroy, OnInit } from '@angular/core'
import { FormBuilder, Validators } from '@angular/forms'
import { Router } from '@angular/router'
import { LoginService } from 'src/app/services/login.service'
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
  emailForm = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]]
  })
  email = ''
  cargandoEmail = true
  editandoEmail = false
  guardandoEmail = false
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
    private loginService: LoginService,
    private onboardingState: OnboardingStateService,
    private router: Router
  ) { }

  ngOnInit(): void {
    void this.inicializar()
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

  async guardarEmail(): Promise<void> {
    this.emailForm.markAllAsTouched()
    if (this.emailForm.invalid || this.guardandoEmail) return

    const nuevoEmail = this.emailForm.controls.email.value?.trim() || ''
    this.guardandoEmail = true
    this.error = ''
    this.mensaje = ''

    try {
      await this.usuarioService.updateMyEmail(nuevoEmail)
      this.email = nuevoEmail
      this.editandoEmail = false
      this.emailForm.reset()
    } catch (error: any) {
      this.error = this.getErrorMessage(error, 'No se pudo actualizar el correo.')
      this.guardandoEmail = false
      return
    }

    try {
      this.limpiarIntervaloReenvio()
      this.segundosParaReenviar = 0
      await this.usuarioService.requestEmailVerification(true)
      this.mensaje = 'Correo actualizado. Te enviamos un código a la nueva dirección.'
      this.iniciarCuentaRegresiva()
    } catch (error: any) {
      const detalle = this.getErrorMessage(error, 'No se pudo enviar el código de verificación.')
      this.error = `El correo se actualizó, pero no se pudo enviar el código. ${detalle}`
    } finally {
      this.guardandoEmail = false
    }
  }

  cancelarEdicionEmail(): void {
    this.editandoEmail = false
    this.emailForm.reset()
  }

  private async cargarEmail(): Promise<void> {
    try {
      const usuario = await this.loginService.getUsuarioDtoByUsername()
      this.email = usuario.email || ''
    } catch {
      this.error = 'No se pudo cargar el correo asociado a tu cuenta.'
    } finally {
      this.cargandoEmail = false
    }
  }

  private async inicializar(): Promise<void> {
    await this.solicitarCodigoInicial()
    await this.cargarEmail()
  }

  get emailEnmascarado(): string {
    const separador = this.email.lastIndexOf('@')
    if (separador <= 0 || separador === this.email.length - 1) {
      return 'Correo no válido'
    }

    const nombre = this.email.slice(0, separador)
    const dominio = this.email.slice(separador)
    const caracteresIniciales = Math.min(4, Math.max(1, nombre.length - 3))
    const caracteresFinales = nombre.length > 6 ? 2 : 0
    const visibles = caracteresIniciales + caracteresFinales
    const asteriscos = '*'.repeat(Math.max(4, nombre.length - visibles))

    return `${nombre.slice(0, caracteresIniciales)}${asteriscos}${caracteresFinales ? nombre.slice(-caracteresFinales) : ''}${dominio}`
  }

  private getErrorMessage(error: any, fallback: string): string {
    const backendError = error?.error
    return typeof backendError === 'string'
      ? backendError
      : backendError?.message || backendError?.error || backendError?.mensaje || fallback
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