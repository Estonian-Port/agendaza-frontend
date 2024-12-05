import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EmpresaAbm } from 'src/app/model/Empresa';
import { EmpresaService } from 'src/app/services/empresa.service';

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

  constructor(private empresaService : EmpresaService, private router : Router) { }

  async ngOnInit(): Promise<void> {
    this.inicializarListaItems()
  }
  
  async inicializarListaItems(){
    this.listaItems = await this.empresaService.getAllEmpresaByUsuarioId()
  }

  editar(id : number){
      this.empresaService.empresaId = id
      this.router.navigateByUrl('/editEmpresa')
  }

  async eliminar(id : number){
    (await this.empresaService.delete(id)).subscribe({
      complete: () => {
        this.inicializarListaItems()
      }
    })
  }

}
