import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoginService } from '../services/login.service';
import { clone } from 'lodash';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor() {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const token = LoginService.getToken()

    if(token){
      const cloned = request.clone({
        headers: request.headers.set("Authorization", "Bearer " + token)
      })
      return next.handle(cloned)
    }
    
    return next.handle(request)
  }
}
