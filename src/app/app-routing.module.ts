import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './helpers/auth.guard';
import { AbmExtraCateringComponent } from './layout/abm/abm-extra-catering/abm-extra-catering.component';
import { AbmClienteComponent } from './layout/abm/abm-cliente/abm-cliente.component';
import { AbmEmpresaComponent } from './layout/abm/abm-empresa/abm-empresa.component';
import { AbmEventoComponent } from './layout/abm/abm-evento/abm-evento.component';
import { AbmExtraEventoComponent } from './layout/abm/abm-extra-evento/abm-extra-evento.component';
import { AbmPagoComponent } from './layout/abm/abm-pago/abm-pago.component';
import { AbmServicioComponent } from './layout/abm/abm-servicio/abm-servicio.component';
import { AbmTipoEventoComponent } from './layout/abm/abm-tipo-evento/abm-tipo-evento.component';
import { AbmUsuarioComponent } from './layout/abm/abm-usuario/abm-usuario.component';
import { AgendaComponent } from './layout/agenda/agenda.component';
import { ConfiguracionComponent } from './layout/configuracion/configuracion.component';
import { EditEmpresaComponent } from './layout/edit/edit-empresa/edit-empresa.component';
import { EditUsuarioPasswordComponent } from './layout/edit/edit-usuario-password/edit-usuario-password.component';
import { EditUsuarioComponent } from './layout/edit/edit-usuario/edit-usuario.component';
import { LoginComponent } from './layout/login/login.component';
import { NotFoundComponent } from './layout/not-found/not-found.component';
import { NuevoEventoComponent } from './layout/nuevo-evento/nuevo-evento.component';
import { SaveClienteComponent } from './layout/save/save-cliente/save-cliente.component';
import { SaveEmpresaComponent } from './layout/save/save-empresa/save-empresa.component';
import { SaveExtraEventoComponent } from './layout/save/save-extra-evento/save-extra-evento.component';
import { SavePagoComponent } from './layout/save/save-pago/save-pago.component';
import { SaveServicioComponent } from './layout/save/save-servicio/save-servicio.component';
import { SaveTipoEventoComponent } from './layout/save/save-tipo-evento/save-tipo-evento.component';
import { SaveUsuarioComponent } from './layout/save/save-usuario/save-usuario.component';
import { SeleccionarAgendaComponent } from './layout/seleccionar-agenda/seleccionar-agenda.component';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: '', 
    canActivate:[AuthGuard], 
    children: [
      { path : '', component: SeleccionarAgendaComponent },
      { path : 'agenda', component: AgendaComponent },
      { path : 'nuevoEvento', component: NuevoEventoComponent },
      { path : 'configuracion', component: ConfiguracionComponent },
      { path : 'abmUsuario', component: AbmUsuarioComponent },
      { path : 'abmEvento', component: AbmEventoComponent },
      { path : 'abmTipoEvento', component: AbmTipoEventoComponent },
      { path : 'abmServicio', component: AbmServicioComponent },
      { path : 'abmExtraEvento', component: AbmExtraEventoComponent },
      { path : 'abmExtraCatering', component: AbmExtraCateringComponent },
      { path : 'abmCliente', component: AbmClienteComponent },
      { path : 'abmPago', component: AbmPagoComponent },
      { path : 'abmEmpresa', component: AbmEmpresaComponent },
      { path : 'saveUsuario', component: SaveUsuarioComponent },
      { path : 'saveTipoEvento', component: SaveTipoEventoComponent },
      { path : 'saveServicio', component: SaveServicioComponent },
      { path : 'saveExtraEvento', component: SaveExtraEventoComponent },
      { path : 'saveExtraCatering', component: SaveExtraEventoComponent },
      { path : 'saveCliente', component: SaveClienteComponent },
      { path : 'savePago', component: SavePagoComponent },
      { path : 'saveEmpresa', component: SaveEmpresaComponent },
      { path : 'editUsuario', component: EditUsuarioComponent },
      { path : 'editUsuarioPassword', component: EditUsuarioPasswordComponent },
      { path : 'editEmpresa', component: EditEmpresaComponent },
      { path: '**', component: NotFoundComponent }
    ]
  }
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
