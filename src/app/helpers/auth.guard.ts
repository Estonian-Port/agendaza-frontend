import { inject } from '@angular/core';
import { CanActivateFn, CanActivateChildFn, Router } from '@angular/router';
import { LoginService } from '../services/login.service';
import { OnboardingStateService } from '../services/onboarding-state.service';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const loginService = inject(LoginService);
  const onboardingState = inject(OnboardingStateService);

  const hasSession = loginService.hasSession();

  if (route.routeConfig?.path === 'login') {
    return hasSession && onboardingState.isRequired()
      ? router.parseUrl('/completar-perfil')
      : true;
  }

  if (!hasSession) {
    return router.parseUrl('/login');
  }

  if (onboardingState.isRequired() && state.url !== '/completar-perfil') {
    return router.parseUrl('/completar-perfil');
  }

  return true;
};

export const authChildGuard: CanActivateChildFn = (route, state) => {
  const router = inject(Router);
  const loginService = inject(LoginService);
  const onboardingState = inject(OnboardingStateService);

  if (!loginService.hasSession()) {
    return router.parseUrl('/login');
  }

  if (onboardingState.isRequired() && state.url !== '/completar-perfil') {
    return router.parseUrl('/completar-perfil');
  }

  return true;
};