import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './layout/login/login.component';
import { PerfilUsuarioComponent } from './layout/perfil-usuario/perfil-usuario.component';

const routes: Routes = [
  {
    path: '',
    component: LoginComponent
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
