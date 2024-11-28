import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Cargo } from 'src/app/model/Cargo';
import { Usuario } from 'src/app/model/Usuario';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-save-usuario',
  templateUrl: './save-usuario.component.html',
})
export class SaveUsuarioComponent implements OnInit {

  usuario! : Usuario
  listaSexo : Array<string> = []
  listaCargo : Array<Cargo> = []

  constructor(private usuarioService : UsuarioService, private router : Router) { }

  async ngOnInit(): Promise<void> {
    this.usuario = new Usuario(0, "", "", "", "", new Date(0,0,0,0,0,0),"MASCULINO",Cargo.EMPLEADO, "")
    this.listaCargo = await this.usuarioService.getAllCargo()
  }

  async save(){
    const item = await this.usuarioService.save(this.usuario)
    this.router.navigateByUrl('/abmUsuario')
  }

  volver(){
    this.router.navigateByUrl('/abmUsuario')
  }

}
