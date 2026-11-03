import { Component, OnInit, SecurityContext } from '@angular/core'
import { AbstractControl, AsyncValidatorFn, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms'
import { DomSanitizer } from '@angular/platform-browser'
import { Router } from '@angular/router'
import { marked } from 'marked'
import { CryptoJsImpl } from 'src/util/cryptoJsImpl'
import { OnboardingStateService } from '../../services/onboarding-state.service'
import { TerminosDTO, TerminosService } from '../../services/terminos.service'
import { LoginService } from 'src/app/services/login.service'
import { UsuarioService } from 'src/app/services/usuario.service'
import { catchError, map, Observable, of } from 'rxjs'

@Component({
  selector: 'app-completar-perfil',
  templateUrl: './completar-perfil.component.html'
})
export class CompletarPerfilComponent implements OnInit {
  form: FormGroup
  terminos: TerminosDTO | null = null
  terminosHtml = ''
  cargandoTerminos = true
  errorTerminos = ''
  mostrarTerminos = false
  enviando = false
  errorSubmit = ''

  constructor(
    private formBuilder: FormBuilder,
    private loginService: LoginService,
    private onboardingState: OnboardingStateService,
    private router: Router,
    private usuarioService: UsuarioService,
    private terminosService: TerminosService,
    private sanitizer: DomSanitizer
  ) {
    this.form = this.formBuilder.group({
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      apellido: ['', [Validators.required, Validators.minLength(2)]],
      email: [''],
      celular: ['', [Validators.required, Validators.min(999999999)]],
      fechaNacimiento: ['', Validators.required],
      username: ['', {
        validators: [Validators.required, Validators.minLength(3)],
        asyncValidators: [this.usernameDisponible()],
        updateOn: 'blur'
      }],
      password: ['', [Validators.required, Validators.minLength(8), Validators.pattern(/^(?=.*[0-9])(?=.*[A-Z]).+$/)]],
      confirmarPassword: ['', Validators.required],
      aceptoTerminos: [false, Validators.requiredTrue]
    }, { validators: this.passwordsMatch })
  }

  ngOnInit(): void {
    this.cargarUsuario()
    this.cargarTerminos()
  }

  private async cargarUsuario(): Promise<void> {
    try {
      const me = await this.loginService.getUsuarioDtoByUsername()
      if (me) {
        this.form.patchValue({
          nombre: me.nombre || '',
          apellido: me.apellido || '',
          celular: me.celular || '',
          fechaNacimiento: me.fechaNacimiento || '',
        })

        // Lógica de username
        const rawUsername = me.username || ''
        const isUsernameEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(rawUsername)
        const usernameControl = this.form.get('username')

        if (isUsernameEmail) {
          usernameControl?.setValue('')
          usernameControl?.enable()
        } else {
          usernameControl?.setValue(rawUsername)
          usernameControl?.disable()
        }

        // Lógica de email
        const rawEmail = me.email || ''
        const emailControl = this.form.get('email')

        if (rawEmail.startsWith('sin-email-') || !rawEmail) {
          emailControl?.setValue('')
          emailControl?.enable()
        } else {
          emailControl?.setValue(rawEmail)
          emailControl?.disable()
        }
      }
    } catch (error) {
      console.error('Error al cargar datos del usuario logueado', error)
    }
  }

  private cargarTerminos(): void {
    this.terminosService.getVigentes().subscribe({
      next: (terminos) => {
        this.terminos = terminos
        const htmlParsed = marked.parse(terminos.texto) as string
        this.terminosHtml = this.sanitizer.sanitize(SecurityContext.HTML, htmlParsed) || ''
        this.cargandoTerminos = false
      },
      error: () => {
        this.errorTerminos = 'No se pudieron cargar los términos y condiciones vigentes.'
        this.cargandoTerminos = false
      }
    })
  }

  async save(): Promise<void> {
    this.form.markAllAsTouched()
    if (this.form.invalid || !this.terminos || this.enviando) return

    this.enviando = true
    this.errorSubmit = ''
    const values = this.form.getRawValue()
    try {
      await this.usuarioService.completeOnboarding({
        nombre: values.nombre,
        apellido: values.apellido,
        celular: values.celular,
        fechaNacimiento: values.fechaNacimiento,
        username: values.username,
        password: values.password,
        aceptoTerminos: true,
        versionTerminos: this.terminos.version
      })
      localStorage.setItem('session', CryptoJsImpl.encryptData(values.username))
      this.onboardingState.completeOnboarding()
      await this.router.navigateByUrl('/')
    } catch {
      this.errorSubmit = 'No se pudieron guardar tus datos. Intenta nuevamente.'
    } finally {
      this.enviando = false
    }
  }

  private usernameDisponible(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      const username = String(control.value || '').trim()
      if (!username) return of(null)

      return this.usuarioService.checkUsername(username).pipe(
        map((response: any) => {
          const result = response?.data ?? response
          const available = typeof result === 'boolean'
            ? result
            : result?.available ?? result?.disponible
          return available === true ? null : { usernameUnavailable: true }
        }),
        catchError(() => of({ usernameCheckFailed: true }))
      )
    }
  }

  private passwordsMatch(group: AbstractControl): ValidationErrors | null {
    const password = group.get('password')?.value
    const confirmation = group.get('confirmarPassword')?.value
    return password && confirmation && password !== confirmation ? { passwordsMismatch: true } : null
  }
}