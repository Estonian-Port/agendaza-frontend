import { Injectable, Injector } from '@angular/core'
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http'
import { from, Observable, throwError } from 'rxjs'
import { catchError, switchMap } from 'rxjs/operators'
import { Router } from '@angular/router'
import { LoginService } from '../services/login.service'
import { ToastService } from '../services/toast.service'
import { OnboardingStateService } from '../services/onboarding-state.service'
import { REST_SERVER_URL } from 'src/util/configuration'

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(
    private injector: Injector,
    private router: Router,
    private toastService: ToastService
  ) { }

  private get loginService(): LoginService {
    return this.injector.get(LoginService)
  }

  private get onboardingState(): OnboardingStateService {
    return this.injector.get(OnboardingStateService)
  }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const isLoginRequest = request.url === `${REST_SERVER_URL}/login`
    const isRefreshRequest = request.url === `${REST_SERVER_URL}/v1/auth/refresh`
    const isLogoutRequest = request.url === `${REST_SERVER_URL}/v1/auth/logout`
    if (isLoginRequest || isRefreshRequest) {
      return next.handle(request).pipe(
        catchError((error: HttpErrorResponse) => {
          this.toastService.showError(this.getErrorMessage(error))
          return throwError(() => error)
        })
      )
    }

    const token = this.loginService.getToken()

    if (!token && this.loginService.getRefreshToken() && !isLogoutRequest) {
      return from(this.loginService.refreshAccessToken()).pipe(
        switchMap(accessToken => next.handle(this.withBearer(request, accessToken))),
        catchError((error: HttpErrorResponse) => {
          this.handleAuthAndToast(error)
          return throwError(() => error)
        })
      )
    }

    return next.handle(token ? this.withBearer(request, token) : request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401 && error.error?.code === 'TOKEN_EXPIRED') {
          const currentToken = this.loginService.getToken()
          if (currentToken && currentToken !== token) {
            return next.handle(this.withBearer(request, currentToken)).pipe(
              catchError((retryError: HttpErrorResponse) => {
                this.handleAuthAndToast(retryError)
                return throwError(() => retryError)
              })
            )
          }

          return from(this.loginService.refreshAccessToken()).pipe(
            switchMap(accessToken => next.handle(this.withBearer(request, accessToken))),
            catchError((refreshError: HttpErrorResponse) => {
              this.handleAuthAndToast(refreshError)
              return throwError(() => refreshError)
            })
          )
        }

        if (error.status === 403 && error.error?.code === 'ONBOARDING_REQUIRED') {
          this.onboardingState.requireOnboarding()
          if (this.router.url !== '/completar-perfil') {
            this.router.navigateByUrl('/completar-perfil', { replaceUrl: true })
          }
          return throwError(() => error)
        }

        // Solo ejecuta toast/deslogeo si NO es un onboarding requerido
        this.handleAuthAndToast(error)
        return throwError(() => error)
      })
    )
  }

  private withBearer(request: HttpRequest<unknown>, token: string): HttpRequest<unknown> {
    return request.clone({ headers: request.headers.set('Authorization', `Bearer ${token}`) })
  }

  private handleAuthAndToast(error: HttpErrorResponse): void {
    if (error.status === 401 && error.error?.code === 'UNAUTHENTICATED') {
      this.loginService.clearAuthData()
      this.router.navigate(['/login'])
    }

    // 2. Muestra SIEMPRE el Toast con el mensaje real que viene del backend
    const errorMessage = this.getErrorMessage(error)
    this.toastService.showError(errorMessage)
  }

  private getErrorMessage(error: HttpErrorResponse): string {
    const backendError = error.error

    if (error.status === 0) {
      return 'Error al conectar con el servidor.'
    }

    // Captura string directo devuelto por el backend (ej: "Usuario no encontrado")
    if (typeof backendError === 'string' && backendError.trim().length > 0) {
      return backendError
    }

    // Captura objeto JSON devuelto por Spring Boot (message, error, mensaje)
    if (backendError && typeof backendError === 'object') {
      return backendError.message || backendError.error || backendError.mensaje || 'Ocurrió un error en la solicitud.'
    }

    if (error.status === 401) return 'Sesión expirada o no autorizada.'
    if (error.status === 404) return 'No se encontró el recurso solicitado.'
    if (error.status === 500 || error.status === 503) return 'Error interno del servidor.'

    return 'Ocurrió un error inesperado.'
  }

}