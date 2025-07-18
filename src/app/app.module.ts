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
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StepBoxComponent } from './components/step-box/step-box.component';
import { PanelAdminComponent } from './layout/panel-admin/panel-admin.component';
import { AbmUsuarioComponent } from './layout/abm/abm-usuario/abm-usuario.component';
import { FilterAbm } from './pipes/filterAbm.pipe';
import { OrderAbmById } from './pipes/orderAbmById.pipe';
import { OrderAbmByIdDesc } from './pipes/orderAbmByIdDesc.pipe';
import { OrderByFechaDesdePrecio } from './pipes/orderByFechaDesdePrecio.pipe';
import { OrderByFechaInicio } from './pipes/orderByFechaInicio.pipe';
import { OrderAbmByNombre } from './pipes/orderAbmByNombre.pipe';
import { siNo } from './pipes/siNo.pipe';
import { FormatEnum } from './pipes/formatEnum.pipe'
import { AbmEventoComponent } from './layout/abm/abm-evento/abm-evento.component';
import { AbmPagoComponent } from './layout/abm/abm-pago/abm-pago.component';
import { AbmClienteComponent } from './layout/abm/abm-cliente/abm-cliente.component';
import { AbmTipoEventoComponent } from './layout/abm/abm-tipo-evento/abm-tipo-evento.component';
import { AbmServicioComponent } from './layout/abm/abm-servicio/abm-servicio.component';
import { AbmEmpresaComponent } from './layout/abm/abm-empresa/abm-empresa.component';
import { AbmExtraEventoComponent } from './layout/abm/abm-extra-evento/abm-extra-evento.component';
import { AbmDataTablePagoComponent } from './components/abm/abm-data-table-pago/abm-data-table-pago.component';
import { AbmDataTableComponent } from './components/abm/abm-data-table/abm-data-table.component';
import { AbmDataTablePaginacionComponent } from './components/abm/abm-data-table-paginacion/abm-data-table-paginacion.component';
import { AbmDataTableEventoComponent } from './components/abm/abm-data-table-evento/abm-data-table-evento.component';
import { AbmDataTableUsuarioComponent } from './components/abm/abm-data-table-usuario/abm-data-table-usuario.component';
import { SaveUsuarioComponent } from './layout/save/save-usuario/save-usuario.component';
import { SaveClienteComponent } from './layout/save/save-cliente/save-cliente.component';
import { SavePagoComponent } from './layout/save/save-pago/save-pago.component';
import { SaveServicioComponent } from './layout/save/save-servicio/save-servicio.component';
import { SaveTipoEventoComponent } from './layout/save/save-tipo-evento/save-tipo-evento.component';
import { SaveEventoComponent } from './layout/save/save-evento/save-evento.component';
import { EditUsuarioComponent } from './layout/edit/edit-usuario/edit-usuario.component';
import { ModalBasicoComponent } from './components/modal/modal-basico/modal-basico.component';
import { EditEmpresaComponent } from './layout/edit/edit-empresa/edit-empresa.component';
import { SaveEmpresaComponent } from './layout/save/save-empresa/save-empresa.component';
import { AbmExtraCateringComponent } from './layout/abm/abm-extra-catering/abm-extra-catering.component';
import { SaveExtraCateringComponent } from './layout/save/save-extra-catering/save-extra-catering.component';
import { SaveExtraEventoComponent } from './layout/save/save-extra-evento/save-extra-evento.component';
import { PrecioTipoEventoComponent } from './layout/precio/precio-tipo-evento/precio-tipo-evento.component';
import { PrecioExtraComponent } from './layout/precio/precio-extra/precio-extra.component';
import { PrecioFormComponent } from './components/precio-form/precio-form.component';
import { ExtraCheckboxComponent } from './components/extra-checkbox/extra-checkbox.component';
import { ExtraVariableCheckboxComponent } from './components/extra-variable-checkbox/extra-variable-checkbox.component';
import { EditEventoPagosComponent } from './layout/edit/edit-evento/edit-evento-pagos/edit-evento-pagos.component';
import { EditEventoExtrasComponent } from './layout/edit/edit-evento/edit-evento-extras/edit-evento-extras.component';
import { EditEventoCateringComponent } from './layout/edit/edit-evento/edit-evento-catering/edit-evento-catering.component';
import { VerEventoComponent } from './layout/ver/ver-evento/ver-evento.component';
import { EditEventoHoraComponent } from './layout/edit/edit-evento/edit-evento-hora/edit-evento-hora.component';
import { ModalListaComponent } from './components/modal/modal-lista/modal-lista.component';
import { ModalEditarComponent } from './components/modal/modal-editar/modal-editar.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { VerClienteComponent } from './layout/ver/ver-cliente/ver-cliente.component';
import { AbmDataTableHeaderComponent } from './components/abm/abm-data-table-header/abm-data-table-header.component';
import { EditEmpleadoCargoComponent } from './layout/edit/edit-cargo-empleado/edit-cargo-empleado.component';
import { EditUsuarioPerfilComponent } from './layout/edit/edit-usuario-perfil/edit-usuario-perfil.component';
import { ModalInformativoComponent } from './components/modal/modal-informativo/modal-informativo.component';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { TruncarTextoPipe } from './pipes/truncarTexto.pipe';
import { AbmEspecificacionComponent } from './layout/abm/abm-especificacion/abm-especificacion.component';
import { HeaderComponent } from './components/header/header.component';
import { ModalEditClienteComponent } from './components/modal/modal-edit-cliente/modal-edit-cliente.component';
import { FormatNumero } from './pipes/formatNumero.pipe';
import { TipoEventoSeleccionadorComponent } from './components/tipo-evento-seleccionador/tipo-evento-seleccionador.component';
import { HoraMinutosComponent } from './components/hora-minutos/hora-minutos.component';
import { ModalPasswordComponent } from './components/modal/modal-password/modal-password.component';
import { SaveClausulaComponent } from './layout/save/save-clausula/save-clausula.component';
import { AbmClausulaComponent } from './layout/abm/abm-clausula/abm-clausula.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    NavbarComponent,
    SeleccionarAgendaComponent,
    CardAgendaComponent,
    NotFoundComponent,
    AgendaComponent,
    SaveEventoComponent,
    StepBoxComponent,
    PanelAdminComponent,
    AbmUsuarioComponent,
    FilterAbm,
    siNo,
    OrderAbmById,
    OrderAbmByIdDesc,
    OrderByFechaDesdePrecio,
    OrderByFechaInicio,
    OrderAbmByNombre,
    AbmEventoComponent,
    AbmDataTableComponent,
    AbmDataTablePaginacionComponent,
    AbmDataTableEventoComponent,
    AbmDataTableUsuarioComponent,
    AbmDataTablePagoComponent,
    AbmPagoComponent,
    AbmClienteComponent,
    AbmTipoEventoComponent,
    AbmServicioComponent,
    AbmEmpresaComponent,
    AbmExtraEventoComponent,
    SaveUsuarioComponent,
    SaveClienteComponent,
    SavePagoComponent,
    SaveServicioComponent,
    SaveTipoEventoComponent,
    EditUsuarioComponent,
    ModalBasicoComponent,
    EditEmpresaComponent,
    SaveEmpresaComponent,
    AbmExtraCateringComponent,
    SaveExtraCateringComponent,
    SaveExtraEventoComponent,
    PrecioTipoEventoComponent,
    PrecioExtraComponent,
    PrecioFormComponent,
    ExtraCheckboxComponent,
    ExtraVariableCheckboxComponent,
    EditEventoPagosComponent,
    EditEventoExtrasComponent,
    EditEventoCateringComponent,
    VerEventoComponent,
    EditEventoHoraComponent,
    ModalListaComponent,
    ModalEditarComponent,
    SidebarComponent,
    VerClienteComponent,
    AbmDataTableHeaderComponent,
    EditEmpleadoCargoComponent,
    EditUsuarioPerfilComponent,
    ModalInformativoComponent,
    SpinnerComponent,
    TruncarTextoPipe,
    AbmEspecificacionComponent,
    HeaderComponent,
    ModalEditClienteComponent,
    FormatEnum,
    FormatNumero,
    TipoEventoSeleccionadorComponent,
    HoraMinutosComponent,
    ModalPasswordComponent,
    SaveClausulaComponent,
    AbmClausulaComponent
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
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
