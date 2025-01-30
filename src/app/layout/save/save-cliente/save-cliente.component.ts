import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Cargo } from 'src/app/model/Cargo';
import { Usuario } from 'src/app/model/Usuario';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-save-cliente',
  templateUrl: './save-cliente.component.html',
})
export class SaveClienteComponent implements OnInit {

  usuario! : Usuario

  constructor(private usuarioService : UsuarioService, private router : Router) { }

  ngOnInit(): void {
    this.usuario = new Usuario(0, "", "", "", "", new Date(0,0,0,0,0,0),"MASCULINO",Cargo.CLIENTE, "",0)
  }

  async save(){
    const item = await this.usuarioService.save(this.usuario)
    this.router.navigateByUrl('/abmCliente')
  }

  volver(){
    this.router.navigateByUrl('/abmCliente')
  }

}
