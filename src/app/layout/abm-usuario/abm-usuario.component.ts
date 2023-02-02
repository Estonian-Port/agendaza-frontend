import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash';
import { ConfiguracionService } from 'src/app/services/configuracion.service';

@Component({
  selector: 'app-abm-usuario',
  templateUrl: './abm-usuario.component.html',
  styleUrls: ['./abm-usuario.component.css']
})
export class AbmUsuarioComponent implements OnInit {

  buscar = ''
  listaItems : Array<any> = []

  cantidadRegistros : number[] = []
  currentRegistro : number = 0

  cantidadPaginas : number[] = []
  currentPagina : number = 1

  classes : String = ""

  constructor(private configuracionService : ConfiguracionService){}
  
  async ngOnInit() {

    this.listaItems = await this.configuracionService.getAllEmpleadosByEmpresaId()
    
    this.listaItems = _.sortBy(this.listaItems, ["id","weight"]);

    this.cantidadRegistros = new Array<number>(this.listaItems.length)
    this.cantidadPaginas = new Array<number>(Math.trunc(this.listaItems.length / 10) + 1)
  }

  siguiente(){
    if(this.currentRegistro >= 0 && this.currentRegistro < (this.cantidadPaginas.length -1) * 10){
      this.currentRegistro += 10
      this.currentPagina += 1
    }
  }

  atras(){
    if(this.currentRegistro > 0 && this.currentRegistro <= (this.cantidadPaginas.length -1) * 10){
      this.currentRegistro -= 10
      this.currentPagina -= 1
    }
  }

  irPagina(pagina : number){
    this.currentRegistro = (pagina - 1 ) * 10
    this.currentPagina = pagina
  }

  actualizarCantidadPaginas(){
    this.currentPagina = 1
    this.currentRegistro = 0
    this.cantidadPaginas = new Array<number>(
      Math.trunc(
        this.listaItems.filter(it => it.contiene(this.buscar)).length / 10) + 1)
  }

}
