import { PerfilUsuarioService } from './../../services/perfilUsuario.service';

import { PerfilUsuario, Usuario } from './../../model/Usuario';
import { Component, OnInit } from '@angular/core';
import {  Router } from '@angular/router';

import * as _ from 'lodash';

import { mostrarErrorConMensaje } from 'src/util/errorHandler';


@Component({
  selector: 'app-perfil-usuario',
  templateUrl: './perfil-usuario.component.html',
  styleUrls: [
    './estilos/perfilUsuario.css',
    './estilos/preferencia_vehiculo.css']
})
export class PerfilUsuarioComponent implements OnInit {

  constructor(private perfilUsuarioService : PerfilUsuarioService , private router: Router) { }


  inicializar() {
    throw new Error('Method not implemented.');
  }
  
  async ngOnInit(): Promise<void> {

    try{
      this.inicializar()
    }catch(e){
      mostrarErrorConMensaje(this, e)
    }
    
  }


}