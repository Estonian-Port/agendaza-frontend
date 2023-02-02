import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './helpers/auth.guard';
import { AbmUsuarioComponent } from './layout/abm-usuario/abm-usuario.component';
import { AgendaComponent } from './layout/agenda/agenda.component';
import { ConfiguracionComponent } from './layout/configuracion/configuracion.component';
import { LoginComponent } from './layout/login/login.component';
import { NotFoundComponent } from './layout/not-found/not-found.component';
import { NuevoEventoComponent } from './layout/nuevo-evento/nuevo-evento.component';
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
      { path : 'AbmUsuario', component: AbmUsuarioComponent },
      { path: '**', component: NotFoundComponent }
    ]
  }
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
