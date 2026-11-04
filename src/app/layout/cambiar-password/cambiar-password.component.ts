import { Component } from '@angular/core'
import { AbstractControl, FormBuilder, Validators } from '@angular/forms'
import { Router } from '@angular/router'
import { OnboardingStateService } from 'src/app/services/onboarding-state.service'
import { UsuarioService } from 'src/app/services/usuario.service'

@Component({
  selector: 'app-cambiar-password',
  templateUrl: './cambiar-password.component.html'
})
export class CambiarPasswordComponent {
  form = this.formBuilder.group({
    password: ['', [Validators.required, Validators.minLength(8), Validators.pattern(/^(?=.*[A-Z])(?=.*\d).+$/)]],
    confirmarPassword: ['', Validators.required]
  }, { validators: this.passwordsMatch })
  passwordVisible = false
  enviando = false
  errorSubmit = ''

  constructor(
    private formBuilder: FormBuilder,
    private usuarioService: UsuarioService,
    private onboardingState: OnboardingStateService,
    private router: Router
  ) { }

  async save(): Promise<void> {
    this.form.markAllAsTouched()
    if (this.form.invalid || this.enviando) return

    this.enviando = true
    this.errorSubmit = ''
    try {
      await this.usuarioService.updateMyPassword(this.form.controls.password.value || '')
      this.onboardingState.setStatus(await this.usuarioService.getEstado())
      if (!this.onboardingState.isPasswordChangeRequired()) {
        await this.router.navigateByUrl('/', { replaceUrl: true })
      } else {
        this.errorSubmit = 'El backend todavía requiere cambiar la contraseña. Intenta nuevamente.'
      }
    } catch (error: any) {
      const backendError = error?.error
      this.errorSubmit = typeof backendError === 'string'
        ? backendError
        : backendError?.message || backendError?.error || backendError?.mensaje || error?.message || 'No se pudo cambiar la contraseña.'
    } finally {
      this.enviando = false
    }
  }

  private passwordsMatch(control: AbstractControl): { passwordsMismatch: boolean } | null {
    const password = control.get('password')?.value
    const confirmation = control.get('confirmarPassword')?.value
    return confirmation && password !== confirmation ? { passwordsMismatch: true } : null
  }
}