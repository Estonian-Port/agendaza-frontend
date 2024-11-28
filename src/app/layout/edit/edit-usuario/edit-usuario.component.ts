import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Cargo } from 'src/app/model/Cargo';
import { Usuario } from 'src/app/model/Usuario';
import { LoginService } from 'src/app/services/login.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-edit-usuario',
  templateUrl: './edit-usuario.component.html',
})
export class EditUsuarioComponent implements OnInit {
  
  usuario = new Usuario(0, "", "", "", "", new Date(0,0,0,0,0,0), "",Cargo.CLIENTE,"")
  listaSexo : Array<string> = []
  listaRol : Array<string> = []

  constructor(private usuarioService : UsuarioService, private loginService : LoginService, private router : Router) { }

  async ngOnInit(): Promise<void> {
    this.usuario = await this.usuarioService.getUsuario()
    this.usuario.cargo = await this.loginService.getCargo()
    
    this.listaRol = await this.usuarioService.getAllCargo()
  }

  async save(){
    const item = await this.usuarioService.save(this.usuario)
    this.router.navigateByUrl('/abmUsuario')
  }

}
