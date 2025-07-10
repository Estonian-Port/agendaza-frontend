import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Usuario, UsuarioEditPassword } from 'src/app/model/Usuario';
import { UsuarioService } from 'src/app/services/usuario.service';
import { LoginService } from 'src/app/services/login.service';
import { Cargo } from 'src/app/model/Cargo';

@Component({
  selector: 'app-edit-usuario-perfil',
  templateUrl: './edit-usuario-perfil.component.html',
})
export class EditUsuarioPerfilComponent implements OnInit {


  usuario = new Usuario(0, "", "", "", "", new Date(0,0,0,0,0,0), "",Cargo.CLIENTE,"",0)

  //========= Modal ========
  modal = false
  usuarioEditPassword = new UsuarioEditPassword(0, "")

  constructor(public loginService : LoginService, private usuarioService : UsuarioService, private router : Router) { }

  async ngOnInit(): Promise<void> {
    this.usuarioService.usuarioId = await this.loginService.getUsuarioId()
    this.usuario = await this.loginService.getUsuarioPerfil()
  }

  async save(){
    const item = await this.usuarioService.save(this.usuario)
    this.router.navigateByUrl("/" + this.usuarioService.perfilVolver)
  }

  volver(){
    this.router.navigateByUrl("/" + this.usuarioService.perfilVolver)
  }

  async editPassword(){
    this.usuarioEditPassword.id  = await this.loginService.getUsuarioId()
    const item = await this.usuarioService.editPassword(this.usuarioEditPassword)
    this.router.navigateByUrl('/abmUsuario')
  }

  // ====== Modal ======

  changeModal(modal: boolean) {
    console.log(this.modal)
    this.modal = modal
    console.log(this.modal)
  }

}
