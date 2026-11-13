import { Injectable } from '@angular/core'

const ONBOARDING_REQUIRED_KEY = 'onboardingRequired'

export type UsuarioEstado = {
  onboardingRequired: boolean
  emailVerificationRequired: boolean
  passwordChangeRequired: boolean
}

@Injectable({
  providedIn: 'root'
})
export class OnboardingStateService {
  private statusLoaded = false
  private passwordChangeRequired = false
  private emailVerificationRequired = false

  requireOnboarding(): void {
    localStorage.setItem(ONBOARDING_REQUIRED_KEY, 'true')
  }

  isRequired(): boolean {
    return localStorage.getItem(ONBOARDING_REQUIRED_KEY) === 'true'
  }

  completeOnboarding(): void {
    localStorage.removeItem(ONBOARDING_REQUIRED_KEY)
  }

  hasLoadedStatus(): boolean {
    return this.statusLoaded
  }

  setStatus(status: UsuarioEstado): void {
    this.statusLoaded = true
    this.passwordChangeRequired = status.passwordChangeRequired
    this.emailVerificationRequired = status.emailVerificationRequired
    if (status.onboardingRequired) {
      this.requireOnboarding()
    } else {
      this.completeOnboarding()
    }
  }

  isPasswordChangeRequired(): boolean {
    return this.passwordChangeRequired
  }

  isEmailVerificationRequired(): boolean {
    return this.emailVerificationRequired
  }

  getRequiredRoute(): string | null {
    if (this.isRequired()) return '/completar-perfil'
    if (this.emailVerificationRequired) return '/verificar-email'
    if (this.passwordChangeRequired) return '/cambiar-password'
    return null
  }

  completePasswordChange(): void {
    this.passwordChangeRequired = false
  }
}