import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Configuracion } from 'src/app/model/Configuracion';
import { ConfiguracionService } from 'src/app/services/configuracion.service';

@Component({
  selector: 'app-configuracion',
  templateUrl: './configuracion.component.html',
  styleUrls: ['./configuracion.component.css']
})
export class ConfiguracionComponent implements OnInit {


  configuracion! : Configuracion

  constructor(private configuracionService : ConfiguracionService, private router : Router) { }

  async ngOnInit(): Promise<void> {
    this.configuracion = await this.configuracionService.getAllCantidadesConfiguracionByEmpresaId()
  }

  abmUsuario(){
    this.router.navigateByUrl('/AbmUsuario')
  }

  abmEvento() {
     this.router.navigateByUrl('/AbmEvento')
  }

  abmAgenda() {
    this.router.navigateByUrl('/AbmAgenda')
 }
}
