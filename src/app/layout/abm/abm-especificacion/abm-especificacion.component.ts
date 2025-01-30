import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Especificacion } from 'src/app/model/Especificacion';
import { EmpresaService } from 'src/app/services/empresa.service';

@Component({
  selector: 'app-abm-especificacion',
  templateUrl: './abm-especificacion.component.html',
  styleUrls: ['./abm-especificacion.component.css']
})
export class AbmEspecificacionComponent implements OnInit {

  listaEspecificaciones: Array<Especificacion> = []

  constructor(public router : Router, public empresaServise : EmpresaService) { }

  async ngOnInit(): Promise<void> {
    this.listaEspecificaciones = await this.empresaServise.getEspecificaciones()
  }

  volver(){
    this.router.navigateByUrl("/panelAdmin")
  }



}
