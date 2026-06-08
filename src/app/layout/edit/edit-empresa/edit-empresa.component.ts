import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Cargo } from 'src/app/model/Cargo';
import { EmpresaAbm } from 'src/app/model/Empresa';
import { EmpresaService } from 'src/app/services/empresa.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-edit-empresa',
  templateUrl: './edit-empresa.component.html',
})
export class EditEmpresaComponent implements OnInit {

  empresa = new EmpresaAbm(0, "", "", Cargo.CLIENTE, "", 0, "", 0,"")

  constructor(
    private empresaService : EmpresaService,
    private location : Location,
    private route: ActivatedRoute,
  ) { }

  async ngOnInit(): Promise<void> {
    const empresaId = Number(this.route.snapshot.queryParamMap.get('empresaId'));
    this.empresa = await this.empresaService.getEmpresaAbm(empresaId)
  }

  save() {
    this.empresaService.save(this.empresa)
    this.volver()
  }

  volver(){
    this.location.back()
  }
}
