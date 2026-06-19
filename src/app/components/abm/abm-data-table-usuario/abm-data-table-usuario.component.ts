import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UsuarioService } from 'src/app/services/usuario.service';
import { EmpresaService } from 'src/app/services/empresa.service';

@Component({
  selector: 'app-abm-data-table-usuario',
  templateUrl: './abm-data-table-usuario.component.html'
})
export class AbmDataTableUsuarioComponent implements OnInit {

  @Input() listaItems : Array<any> = []
  @Input() listaHeader : Array<String> = []
  @Input() buscar = ''
  @Input() esCliente: Boolean = false

  @Output() outputEditar = new EventEmitter<number>();
  @Output() outputEliminar = new EventEmitter<number>();

  modal = false
  idEliminar = 0
  cuerpoModal = ""
  tituloModal = ""
  botonModal = ""
  nombreEmpresa = ""

  constructor(
    public empresaService : EmpresaService,
    private usuarioService: UsuarioService 
  ) { }

  async ngOnInit(): Promise<void> {
    const empresaId = await this.usuarioService.getEmpresaId();
    
    const empresa = await this.empresaService.getEmpresa(empresaId);
    this.nombreEmpresa = empresa.nombre;
  }

  editarUsuario(id: number){
    this.outputEditar.emit(id);
  }

  editarCliente(id: number){
    this.outputEditar.emit(id)
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

  eliminar(id: number){
    this.outputEliminar.emit(id);
  }
}