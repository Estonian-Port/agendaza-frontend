import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './layout/login/login.component';
import { PerfilUsuarioComponent } from './layout/perfil-usuario/perfil-usuario.component';
import { SeleccionarAgendaComponent } from './layout/seleccionar-agenda/seleccionar-agenda.component';

const routes: Routes = [
  {
    path: '',
    component: LoginComponent
  },
  {
    path: 'seleccionarAgenda',
    component: SeleccionarAgendaComponent
  },
  {
    path: 'perfilUsuario/:id',
    component: PerfilUsuarioComponent,
  }
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
