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
  itemsToDisplay : Array<any> = []
  cantidadRegistros : number[] = []
  cantidadPaginas : number[] = []
  currentPage : number = 1
  beginItem : number = 0
  classes : String = ""

  constructor(private configuracionService : ConfiguracionService){}
  
  async ngOnInit() {

    this.listaItems = await this.configuracionService.getAllEmpleadosByEmpresaId()
    
    this.listaItems = _.sortBy(this.listaItems, ["id","weight"]);

    this.cantidadRegistros = new Array<number>(this.listaItems.length)
    this.cantidadPaginas = new Array<number>(Math.trunc(this.listaItems.length / 10) + 1)

    this.actualizarLista()
  }

  siguiente(){
    if(this.currentPage >= 1 && this.currentPage < this.cantidadPaginas.length){
      this.currentPage = this.currentPage + 1
      this.classes = "active"
      this.actualizarLista()
    }
  }

  atras(){
    if(this.currentPage > 1 && this.currentPage <= this.cantidadPaginas.length){
      this.currentPage = this.currentPage - 1
      this.actualizarLista()
    }
  }

  irPagina(pagina : number, event : Event){
    this.currentPage = pagina
    this.actualizarLista()
  }

  actualizarLista(){
    if(this.currentPage == 1){
      this.beginItem = 0
    }else{
      this.beginItem = (this.currentPage * 10) - 10
    }

    this.itemsToDisplay = this.listaItems.slice(this.beginItem, this.currentPage * 10)
  }
}
