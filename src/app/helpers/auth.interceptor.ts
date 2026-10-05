import { Injectable } from '@angular/core'
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http'
import { Observable, throwError } from 'rxjs'
import { catchError } from 'rxjs/operators'
import { Router } from '@angular/router'
import { LoginService } from '../services/login.service'
import { ToastService } from '../services/toast.service'

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(
    private loginService: LoginService,
    private router: Router,
    private toastService: ToastService
  ) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const token = this.loginService.getToken()

    const authReq = token
      ? request.clone({ headers: request.headers.set('Authorization', `Bearer ${token}`) })
      : request

    return next.handle(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        this.handleAuthAndToast(error)
        return throwError(() => error)
      })
    )
  }

  private handleAuthAndToast(error: HttpErrorResponse): void {
    // 1. Redirección por sesión expirada
    if (error.status === 401) {
      this.clearStorage()
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

  private clearStorage(): void {
    localStorage.removeItem('token')
    localStorage.removeItem('session')
    localStorage.removeItem('usuarioId')
    localStorage.removeItem('empresa')
    localStorage.removeItem('cargo')
  }
}