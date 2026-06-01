import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Usuario, UsuarioEditPassword } from 'src/app/model/Usuario';
import { UsuarioService } from 'src/app/services/usuario.service';
import { LoginService } from 'src/app/services/login.service';
import { Cargo } from 'src/app/model/Cargo';
import { Location } from '@angular/common';

@Component({
  selector: 'app-edit-usuario-perfil',
  templateUrl: './edit-usuario-perfil.component.html',
})
export class EditUsuarioPerfilComponent implements OnInit {


  usuario = new Usuario(0, "", "", "", "", new Date(0,0,0,0,0,0), "",Cargo.CLIENTE,"",0)

  //========= Modal ========
  modal = false
  usuarioEditPassword : string = ""

  constructor(
    public loginService : LoginService,
    private usuarioService : UsuarioService,
    private location: Location) { }

  async ngOnInit(): Promise<void> {
    this.usuario = await this.loginService.getUsuarioPerfil()
  }

  async save(){
    const item = await this.usuarioService.save(this.usuario)
    this.volver()
  }

  volver(){
    this.location.back()
  }

  async editPassword(){
    const item = await this.usuarioService.updatePassword(this.loginService.getUsuarioId(), this.usuarioEditPassword)
    this.volver()
  }

  // ====== Modal ======

  changeModal(modal: boolean) {
    this.modal = modal
  }

}
