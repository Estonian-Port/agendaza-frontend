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
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StepBoxComponent } from './components/step-box/step-box.component';
import { ConfiguracionComponent } from './layout/configuracion/configuracion.component';
import { AbmUsuarioComponent } from './layout/abm/abm-usuario/abm-usuario.component';
import { FilterAbm } from './pipes/filterAbm.pipe';
import { OrderAbm } from './pipes/orderAbm.pipe';
import { AbmEventoComponent } from './layout/abm/abm-evento/abm-evento.component';
import { AbmDataTableComponent } from './components/abm-data-table/abm-data-table.component';
import { AbmDataTableHeaderComponent } from './components/abm-data-table-header/abm-data-table-header.component';
import AbmAgendaComponent from './layout/abm/abm-agenda/abm-agenda.component';
import { AbmDataTableEventoComponent } from './components/abm-data-table-evento/abm-data-table-evento.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    NavbarComponent,
    SeleccionarAgendaComponent,
    CardAgendaComponent,
    NotFoundComponent,
    AgendaComponent,
    NuevoEventoComponent,
    StepBoxComponent,
    ConfiguracionComponent,
    AbmUsuarioComponent,
    FilterAbm,
    OrderAbm,
    AbmEventoComponent,
    AbmDataTableComponent,
    AbmDataTableHeaderComponent,
    AbmAgendaComponent,
    AbmDataTableEventoComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
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
