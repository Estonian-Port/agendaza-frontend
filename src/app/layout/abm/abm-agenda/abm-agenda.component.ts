import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash';
import { ConfiguracionService } from 'src/app/services/configuracion.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-abm-agenda',
  templateUrl: './abm-agenda.component.html',
  styleUrls: ['./abm-agenda.component.css']
})
export default class AbmAgendaComponent implements OnInit {

  buscar = ''
  listaItems : Array<any> = []
  listaHeader : Array<any> =[]
  cantidadRegistros : number[] = []
  cantidadPaginas : number[] = []
  currentRegistro : number = 0

  constructor(private usuarioSevice : UsuarioService) { }

  async ngOnInit(): Promise<void> {
    //TODO cambiar a getAllAgendaByUsuarioId
    this.listaItems = await this.usuarioSevice.getAllUsuariosByEmpresaId()
    this.listaItems = _.sortBy(this.listaItems, ["id","weight"]);

    this.cantidadRegistros = new Array<number>(this.listaItems.length)
    this.cantidadPaginas = new Array<number>(Math.trunc(this.listaItems.length / 10) + 1)

    this.listaHeader.push("id")
    this.listaHeader.push("Nombre")
    this.listaHeader.push("Apellido")
    this.listaHeader.push("Usuario")
  }

  updateCurrentRegistro(registro: number){
    this.currentRegistro = registro
  }

  updatePalabraBuscar(palabraBuscar: string){
    this.buscar = palabraBuscar
  }

  updateCantidadPaginas(cantidadPaginas: number[]){
    this.cantidadPaginas = cantidadPaginas
  }
}
