import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { LoginService } from 'src/app/services/login.service';
import { Router } from '@angular/router';
import { EmpresaService } from 'src/app/services/empresa.service';


@Component({
  selector: 'app-abm-data-table-usuario',
  templateUrl: './abm-data-table-usuario.component.html'
})
export class AbmDataTableUsuarioComponent implements OnInit {

  usuarioId : number = 0

  @Input()
  listaItems : Array<any> = []

  @Input()
  listaHeader : Array<String> = []

  @Input()
  buscar = ''

  @Input()
  esCliente: Boolean = false

  @Output()
  outputEditar = new EventEmitter<number>();

  @Output() 
  outputEliminar = new EventEmitter<number>()

  constructor(private router : Router, public empresaService : EmpresaService) { }

  modal = false
  idEliminar = 0
  cuerpoModal = ""
  tituloModal = ""
  botonModal = ""
  nombreEmpresa = ""

  async ngOnInit(): Promise<void> {
    this.nombreEmpresa = (await this.empresaService.getEmpresa()).nombre
  }

  editarUsuario(id: number){
    this.outputEditar.emit(id)
    this.router.navigateByUrl("/editCargoEmpleado")
  }

  editarCliente(id: number){
    //TODO
    //this.outputEditar.emit(id)
    //this.router.navigateByUrl("/editCargoEmpleado")
  }

  setModal(modal : boolean){
    this.modal = modal
  }

  modalParaEliminar(id : number, nombre : string){
    this.idEliminar = id
    this.tituloModal = "Eliminar Empleado"
    this.cuerpoModal = "Quiere eliminar al empleado del salon: " + nombre + "?"
    this.botonModal = "Eliminar"
    this.setModal(!this.modal)
  }

  eliminar(id : number){
    this.outputEliminar.emit(this.idEliminar);
  }

}
