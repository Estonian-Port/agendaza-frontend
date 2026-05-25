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

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(
    private loginService: LoginService,
    private router: Router
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
    // Si el backend está caído (status 0 o 503) o hay error de token (403)
    if (error.status === 0 || error.status === 403 || error.status === 503) {
      this.clearStorage()
      this.router.navigate(['/login'])
    }
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
