import { Location } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Cargo } from 'src/app/model/Cargo';
import { Usuario } from 'src/app/model/Usuario';
import { LoginService } from 'src/app/services/login.service';
import { UsuarioService } from 'src/app/services/usuario.service';


@Component({
  selector: 'app-edit-cargo-empleado',
  templateUrl: './edit-cargo-empleado.component.html',
})
export class EditEmpleadoCargoComponent implements OnInit {

  usuario = new Usuario(0, "", "", "", "", new Date(0,0,0,0,0,0), "",Cargo.CLIENTE,"",0)
  listaCargo : Array<string> = []

  constructor(
    private usuarioService : UsuarioService,
    private loginService : LoginService,
    private location : Location,
    private route: ActivatedRoute,
  ) { }

  async ngOnInit(): Promise<void> {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    this.usuario = await this.usuarioService.getUsuario(id)
    this.listaCargo = await this.loginService.getAllCargo()
  }

  usuarioAdmin(){
    return this.usuario.cargo == Cargo.ADMIN
  }

  async save(){
    const item = await this.loginService.saveCargo(this.usuario)
    this.volver()
  }

  volver(){
    this.location.back()
  }

}
