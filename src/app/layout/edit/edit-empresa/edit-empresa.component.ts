import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Cargo } from 'src/app/model/Cargo';
import { EmpresaAbm } from 'src/app/model/Empresa';
import { EmpresaService } from 'src/app/services/empresa.service';

@Component({
  selector: 'app-edit-empresa',
  templateUrl: './edit-empresa.component.html',
})
export class EditEmpresaComponent implements OnInit {

  empresa = new EmpresaAbm(0, "", "", Cargo.CLIENTE, "", 0, "", 0,"")

  constructor(private empresaService : EmpresaService, private router : Router) { }

  async ngOnInit(): Promise<void> {
    this.empresa = await this.empresaService.getEmpresaAbm()

  }

  save() {
    this.empresaService.save(this.empresa)
    this.router.navigateByUrl("/abmEmpresa")
  }

  volver(){
    this.router.navigateByUrl("/abmEmpresa")
  }


}
