import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router'; 
import { LoginService } from '../services/login.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private loginService : LoginService, private router: Router) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const token = this.loginService.getToken()

    if (token) {
      const cloned = request.clone({
        headers: request.headers.set("Authorization", "Bearer " + token)
      });
      return next.handle(cloned).pipe(
        catchError((error: HttpErrorResponse) => {

          // Si hay un error de conexión o el backend está caído (status 0 o 503) o error de token 403
          if (error.status === 0 ) {
            
            // Limpiar el token del localStorage
            localStorage.removeItem('token');
            localStorage.removeItem('session');
            localStorage.removeItem('empresa');
            localStorage.removeItem('cargo');

            // Redirigir a la página de login
            this.router.navigate(['/login']);
          }

          // Retornar el error como un observable para continuar el flujo
          return throwError(() => error);
        })
      );
    }
    
    return next.handle(request)
  }
}
