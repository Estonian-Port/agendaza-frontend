import { Injectable } from '@angular/core'

const ONBOARDING_REQUIRED_KEY = 'onboardingRequired'

@Injectable({
  providedIn: 'root'
})
export class OnboardingStateService {
  private statusLoaded = false
  private passwordChangeRequired = false

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

  setStatus(status: { onboardingRequired: boolean; passwordChangeRequired: boolean }): void {
    this.statusLoaded = true
    this.passwordChangeRequired = status.passwordChangeRequired
    if (status.onboardingRequired) {
      this.requireOnboarding()
    } else {
      this.completeOnboarding()
    }
  }

  isPasswordChangeRequired(): boolean {
    return this.passwordChangeRequired
  }

  completePasswordChange(): void {
    this.passwordChangeRequired = false
  }
}