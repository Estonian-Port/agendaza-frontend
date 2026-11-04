import { inject } from '@angular/core';
import { CanActivateFn, CanActivateChildFn, Router } from '@angular/router';
import { LoginService } from '../services/login.service';
import { OnboardingStateService } from '../services/onboarding-state.service';
import { UsuarioService } from '../services/usuario.service';

const checkRoute = async (url: string, isLoginRoute: boolean): Promise<boolean | ReturnType<Router['parseUrl']>> => {
  const router = inject(Router);
  const loginService = inject(LoginService);
  const onboardingState = inject(OnboardingStateService);
  const usuarioService = inject(UsuarioService);

  const hasSession = loginService.hasSession();

  if (isLoginRoute) {
    if (!hasSession) return true
  } else if (!hasSession) {
    return router.parseUrl('/login')
  }

  if (!onboardingState.hasLoadedStatus()) {
    try {
      onboardingState.setStatus(await usuarioService.getEstado())
    } catch {
      return false
    }
  }

  if (onboardingState.isRequired() && url !== '/completar-perfil') {
    return router.parseUrl('/completar-perfil');
  }

  if (!onboardingState.isRequired() && onboardingState.isPasswordChangeRequired() && url !== '/cambiar-password') {
    return router.parseUrl('/cambiar-password')
  }

  if (isLoginRoute && onboardingState.isPasswordChangeRequired()) {
    return router.parseUrl('/cambiar-password')
  }

  return true;
};

export const authGuard: CanActivateFn = (route, state) =>
  checkRoute(state.url, route.routeConfig?.path === 'login')

export const authChildGuard: CanActivateChildFn = (_route, state) =>
  checkRoute(state.url, false)