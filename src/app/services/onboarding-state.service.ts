import { Injectable } from '@angular/core'

const ONBOARDING_REQUIRED_KEY = 'onboardingRequired'

@Injectable({
  providedIn: 'root'
})
export class OnboardingStateService {
  requireOnboarding(): void {
    localStorage.setItem(ONBOARDING_REQUIRED_KEY, 'true')
  }

  isRequired(): boolean {
    return localStorage.getItem(ONBOARDING_REQUIRED_KEY) === 'true'
  }

  completeOnboarding(): void {
    localStorage.removeItem(ONBOARDING_REQUIRED_KEY)
  }
}