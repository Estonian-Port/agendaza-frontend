import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { LoginComponent } from './layout/login/login.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SeleccionarAgendaComponent } from './layout/seleccionar-agenda/seleccionar-agenda.component';
import { CardAgendaComponent } from './components/card-agenda/card-agenda.component';
import { AuthInterceptor } from './helpers/auth.interceptor';
import { NotFoundComponent } from './layout/not-found/not-found.component';
import { FullCalendarModule } from '@fullcalendar/angular';
import { AgendaComponent } from './layout/agenda/agenda.component';
import { NuevoEventoComponent } from './layout/nuevo-evento/nuevo-evento.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    NavbarComponent,
    SeleccionarAgendaComponent,
    CardAgendaComponent,
    NotFoundComponent,
    AgendaComponent,
    NuevoEventoComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    NgbModule,
    FullCalendarModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true
    }
  ],
  bootstrap: [ AppComponent ]

})
export class AppModule { }
