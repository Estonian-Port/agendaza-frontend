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

  /**
   * Intercepta las peticiones HTTP para añadir el token de autenticación
   */
  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const token = this.loginService.getToken()

    // Si hay token, añadirlo al header Authorization
    if (token) {
      const cloned = request.clone({
        headers: request.headers.set("Authorization", "Bearer " + token)
      })

      return next.handle(cloned).pipe(
        catchError((error: HttpErrorResponse) => {
          this.handleAuthError(error)
          return throwError(() => error)
        })
      )
    }

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        this.handleAuthError(error)
        return throwError(() => error)
      })
    )
  }

  /**
   * Maneja los errores de autenticación
   */
  private handleAuthError(error: HttpErrorResponse): void {
    const errorMessage = this.getErrorMessage(error)

    if (error.status === 0 || error.status === 404 || error.status === 500) {
      this.toastService.showError(errorMessage)
    }

    if (error.status === 403 || error.status === 503) {
      this.clearStorage()
      this.router.navigate(['/login'])
    }
  }

  private getErrorMessage(error: HttpErrorResponse): string {
    const backendError = error.error

    if (error.status === 0) {
      return 'Error al conectar con el servidor.'
    }

    if (typeof backendError === 'string' && backendError.trim().length > 0) {
      return backendError
    }

    if (backendError && typeof backendError === 'object') {
      if (backendError.message) {
        return backendError.message
      }

      if (backendError.error) {
        return backendError.error
      }

      if (backendError.mensaje) {
        return backendError.mensaje
      }
    }

    if (error.status === 404) {
      return 'No se encontró la información solicitada.'
    }

    if (error.status === 500 || error.status === 503) {
      return 'Error del servidor. Inténtalo nuevamente más tarde.'
    }

    return 'Ocurrió un error inesperado.'
  }

  /**
   * Limpia el almacenamiento local
   */
  private clearStorage(): void {
    localStorage.removeItem('token')
    localStorage.removeItem('session')
    localStorage.removeItem('usuarioId')
    localStorage.removeItem('empresa')
    localStorage.removeItem('cargo')
  }
}
