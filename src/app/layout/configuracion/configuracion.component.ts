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


  configuracion = new Configuracion(0,0,0,0,0,0,0,0,0)

  constructor(private configuracionService : ConfiguracionService, private router : Router) { }

  async ngOnInit(): Promise<void> {
    this.configuracion = await this.configuracionService.getAllCantidadesConfiguracionByUsuarioIdAndEmpresaId()
  }

  abmUsuario(){
    this.router.navigateByUrl('/abmUsuario')
  }

  abmEvento() {
     this.router.navigateByUrl('/abmEvento')
  }

  abmExtra() {
    this.router.navigateByUrl('/abmExtraEvento')
  }

  abmCatering() {
    this.router.navigateByUrl('/abmExtraCatering')
  }

  abmServicio() {
    this.router.navigateByUrl('/abmServicio')
  }

  abmEmpresa() {
    this.router.navigateByUrl('/abmEmpresa')
  }

  abmTipoEvento() {
    this.router.navigateByUrl('/abmTipoEvento')
  }

  abmPago() {
    this.router.navigateByUrl('/abmPago')
  }

  abmCliente() {
    this.router.navigateByUrl('/abmCliente')
  }
}
