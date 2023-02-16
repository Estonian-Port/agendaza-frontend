import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
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
import { AbmPagoComponent } from './layout/abm/abm-pago/abm-pago.component';
import { AbmClienteComponent } from './layout/abm/abm-cliente/abm-cliente.component';
import { AbmTipoEventoComponent } from './layout/abm/abm-tipo-evento/abm-tipo-evento.component';
import { AbmServicioComponent } from './layout/abm/abm-servicio/abm-servicio.component';
import { AbmEmpresaComponent } from './layout/abm/abm-empresa/abm-empresa.component';
import { AbmExtraComponent } from './layout/abm/abm-extra/abm-extra.component';
import { SeleccionarExtraComponent } from './layout/seleccionar-extra/seleccionar-extra.component';
import { AbmDataTablePagoComponent } from './components/abm/abm-data-table-pago/abm-data-table-pago.component';
import { AbmDataTableComponent } from './components/abm/abm-data-table/abm-data-table.component';
import { AbmDataTableHeaderComponent } from './components/abm/abm-data-table-header/abm-data-table-header.component';
import { AbmDataTableEventoComponent } from './components/abm/abm-data-table-evento/abm-data-table-evento.component';
import { AbmDataTableUsuarioComponent } from './components/abm/abm-data-table-usuario/abm-data-table-usuario.component';
import { SaveUsuarioComponent } from './layout/save/save-usuario/save-usuario.component';
import { SaveClienteComponent } from './layout/save/save-cliente/save-cliente.component';
import { SaveExtraComponent } from './layout/save/save-extra/save-extra.component';
import { SavePagoComponent } from './layout/save/save-pago/save-pago.component';
import { SaveServicioComponent } from './layout/save/save-servicio/save-servicio.component';
import { SaveTipoEventoComponent } from './layout/save/save-tipo-evento/save-tipo-evento.component';
import { EditUsuarioComponent } from './layout/edit/edit-usuario/edit-usuario.component';
import { EditUsuarioPasswordComponent } from './layout/edit/edit-usuario-password/edit-usuario-password.component';
import { ModalComponent } from './components/modal/modal.component';
import { EditEmpresaComponent } from './layout/edit/edit-empresa/edit-empresa.component';

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
    SeleccionarExtraComponent,
    AbmEventoComponent,
    AbmDataTableComponent,
    AbmDataTableHeaderComponent,
    AbmDataTableEventoComponent,
    AbmDataTableUsuarioComponent,
    AbmDataTablePagoComponent,
    AbmPagoComponent,
    AbmClienteComponent,
    AbmTipoEventoComponent,
    AbmServicioComponent,
    AbmEmpresaComponent,
    AbmExtraComponent,
    SaveUsuarioComponent,
    SaveClienteComponent,
    SaveExtraComponent,
    SavePagoComponent,
    SaveServicioComponent,
    SaveTipoEventoComponent,
    EditUsuarioComponent,
    EditUsuarioPasswordComponent,
    ModalComponent,
    EditEmpresaComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    NgbModule,
    FullCalendarModule,
    ReactiveFormsModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true
    }
  ],
  bootstrap: [ AppComponent ]

})
export class AppModule { }
