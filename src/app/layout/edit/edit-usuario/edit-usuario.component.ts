import { Location } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Cargo } from 'src/app/model/Cargo';
import { Usuario } from 'src/app/model/Usuario';
import { LoginService } from 'src/app/services/login.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-edit-usuario',
  templateUrl: './edit-usuario.component.html',
})
export class EditUsuarioComponent implements OnInit {
  
  usuario = new Usuario(0, "", "", "", "", new Date(0,0,0,0,0,0), "",Cargo.CLIENTE,"",0)
  listaSexo : Array<string> = []
  listaRol : Array<string> = []

  constructor(
    private usuarioService : UsuarioService,
    private location : Location,
    private route: ActivatedRoute,
  ) { }

  async ngOnInit(): Promise<void> {
    const id = Number(this.route.snapshot.queryParamMap.get('usuarioId'));

    this.usuario = await this.usuarioService.getUsuario(id)
    this.usuario.cargo = await this.usuarioService.getCargoByUsuarioAndEmpresa(this.usuario.id)
    console.log(this.usuario.cargo)

    this.listaRol = await this.usuarioService.getAllCargo()
  }

  async save(){
    const item = await this.usuarioService.save(this.usuario)
    this.location.back()
  }

  volver(){
    this.location.back()
  }

}
