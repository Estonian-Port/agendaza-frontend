import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Usuario } from 'src/app/model/Usuario';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-edit-usuario-password',
  templateUrl: './edit-usuario-password.component.html',
  styleUrls: ['./edit-usuario-password.component.css']
})
export class EditUsuarioPasswordComponent implements OnInit {

  usuario = new Usuario(0, "", "", "", "", new Date(0,0,0,0,0,0), "","","", true)

  constructor(private usuarioService : UsuarioService, private router : Router) { }

  ngOnInit(): void {
  }

}
