import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EmpresaAbm } from 'src/app/model/Empresa';
import { EmpresaService } from 'src/app/services/empresa.service';
import { LoginService } from 'src/app/services/login.service'; // <-- 1. Importamos LoginService

@Component({
  selector: 'app-abm-empresa',
  templateUrl: './abm-empresa.component.html', 
  styleUrls: ['./abm-empresa.component.css'],
})
export class AbmEmpresaComponent implements OnInit {

  buscar = ''
  listaItems : Array<EmpresaAbm> = []
  cantidadRegistros : number=0
  cantidadPaginas : number[] = []
  currentRegistro : number = 0
  pageNumber : number = 0
  cantidadEventos : number = 0
  primeraBusqueda : Boolean = true

  constructor(
    private empresaService : EmpresaService, 
    private loginService : LoginService,
    private router : Router
  ) { }

  async ngOnInit(): Promise<void> {
    this.inicializarListaItems()
  }
  
  async inicializarListaItems(){
    const usuarioId = await this.loginService.getUsuarioId();
    this.listaItems = await this.empresaService.getAllEmpresaByUsuarioId(usuarioId);
  }

  editar(id : number){
      this.router.navigate(['/editEmpresa'], { queryParams: { empresaId: id } });
  }

}