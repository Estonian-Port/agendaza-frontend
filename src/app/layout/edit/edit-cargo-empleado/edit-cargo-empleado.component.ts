import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Cargo } from 'src/app/model/Cargo';
import { Usuario } from 'src/app/model/Usuario';
import { LoginService } from 'src/app/services/login.service';
import { UsuarioService } from 'src/app/services/usuario.service';


@Component({
  selector: 'app-edit-cargo-empleado',
  templateUrl: './edit-cargo-empleado.component.html',
})
export class EditEmpleadoCargoComponent implements OnInit {

  usuario = new Usuario(0, "", "", "", "", new Date(0,0,0,0,0,0), "",Cargo.CLIENTE,"")
  listaCargo : Array<string> = []

  constructor(private usuarioService : UsuarioService, private loginService : LoginService, private router : Router) { }

  async ngOnInit(): Promise<void> {
    this.usuario = await this.usuarioService.getUsuario()
    this.listaCargo = await this.usuarioService.getAllCargo()
  }

  usuarioAdmin(){
    return this.usuario.cargo == Cargo.ADMIN
  }

  async save(){
    const item = await this.usuarioService.saveCargo(this.usuario)
    this.router.navigateByUrl('/abmUsuario')
  }

  volver(){
    this.router.navigateByUrl('/abmUsuario')
  }

}
