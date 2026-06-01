import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Especificacion } from 'src/app/model/Especificacion';
import { EmpresaService } from 'src/app/services/empresa.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-abm-especificacion',
  templateUrl: './abm-especificacion.component.html',
  styleUrls: ['./abm-especificacion.component.css']
})
export class AbmEspecificacionComponent implements OnInit {

  listaEspecificaciones: Array<Especificacion> = []

  constructor(
    public router : Router,
    public empresaService : EmpresaService,
    public usuarioService : UsuarioService,
    private location: Location
  ) { }

  async ngOnInit(): Promise<void> {
    const empresaId = await this.usuarioService.getEmpresaId();
    this.listaEspecificaciones = await this.empresaService.getEspecificaciones(empresaId)
  }

  volver(){
    this.location.back()
  }

}
