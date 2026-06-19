import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PanelAdmin as PanelAdmin } from 'src/app/model/Configuracion';
import { Empresa } from 'src/app/model/Empresa';
import { EmpresaService } from 'src/app/services/empresa.service';
import { LoginService } from 'src/app/services/login.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-panel-admin',
  templateUrl: './panel-admin.component.html',
})
export class PanelAdminComponent implements OnInit {

  configuracion = new PanelAdmin(0,0,0,0,0,0,0,0,0,0)
  empresa = new Empresa(0,"")

  constructor(
    private empresaService : EmpresaService,
    private router : Router, 
    private usuarioService : UsuarioService,
    public loginService: LoginService
  ) { }

  async ngOnInit(): Promise<void> {
    const empresaId = await this.usuarioService.getEmpresaId();
    this.empresa = await this.empresaService.getEmpresa(empresaId)
    this.configuracion = await this.empresaService.getAllCantidadesForPanelAdminByEmpresaId(empresaId)
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

  abmTipoEvento() {
    this.router.navigateByUrl('/abmTipoEvento')
  }

  abmPago() {
    this.router.navigateByUrl('/abmPago')
  }

  abmCliente() {
    this.router.navigateByUrl('/abmCliente')
  }

  abmClausula() {
    this.router.navigateByUrl('/abmClausula')
  }

  volverCalendario(){
    this.router.navigateByUrl('/agenda')
  }
}