import { Component, OnInit } from '@angular/core';
import { Capacidad } from 'src/app/model/Capacidad';
import { EventoVer } from 'src/app/model/Evento';
import { Cliente, UsuarioAbm} from 'src/app/model/Usuario';
import { Router, ActivatedRoute } from '@angular/router';
import { EventoService } from 'src/app/services/evento.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-ver-cliente',
  templateUrl: './ver-cliente.component.html',
})
export class VerClienteComponent implements OnInit {

  evento : EventoVer = new EventoVer(0,"", "","","", "",new Capacidad(0,0,0),0,
  0,[],[],0,"",[],[], new Cliente(0,"","","","",0),0, new UsuarioAbm(0,"",""),"","", "")

  cliente = ""
  eventos: Array<any> = []
  cantidadEventos = 0
  modal = false
  tituloModal=""

  constructor(
    private eventoService : EventoService, 
    private usuarioService: UsuarioService, 
    private location : Location,
    private route: ActivatedRoute,
  ) { }

async ngOnInit() {
    this.route.queryParams.subscribe(async params => {
      if (params['eventoId']) {
        const eventoId = Number(params['eventoId']);
        
        this.evento = await this.eventoService.getEventoVer(eventoId);
        const empresaId = await this.usuarioService.getEmpresaId();

        const datosUsuario = await this.usuarioService.getEventosByUsuarioAndEmpresa(
          this.evento.cliente.id, 
          empresaId
        );

        this.eventos = datosUsuario.eventos;
        this.cantidadEventos = datosUsuario.cantidad;

        this.cliente = this.evento.cliente.nombre + " " + this.evento.cliente.apellido;
      }
    });
  }

  volver(){
    this.location.back();
  }

  masDe10Eventos(): Boolean {
    return this.cantidadEventos > 10
  }

  editModal(){
    this.tituloModal = "Editar cliente"
    this.setModalEditar(!this.modal)
  }

  setModalEditar(modal : boolean){
    this.modal = modal
  }

  async editCliente(cliente : Cliente){
    const clienteEdit : Cliente = await this.usuarioService.saveCliente(cliente)
    this.cliente = clienteEdit.nombre + " " + clienteEdit.apellido
  }
}