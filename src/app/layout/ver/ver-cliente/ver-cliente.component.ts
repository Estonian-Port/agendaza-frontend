import { Component, OnInit } from '@angular/core';
import { Capacidad } from 'src/app/model/Capacidad';
import { EventoVer } from 'src/app/model/Evento';
import { Cliente, ClienteUpdateDTO, UsuarioAbm} from 'src/app/model/Usuario';
import { Router, ActivatedRoute } from '@angular/router';
import { EventoService } from 'src/app/services/evento.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Location } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-ver-cliente',
  templateUrl: './ver-cliente.component.html',
})
export class VerClienteComponent implements OnInit {

  evento : EventoVer = new EventoVer(0,"", "","","", "",0,0,0,
  "",[],[],0,"",[],[], new Cliente(0,"","","","",0),0, new UsuarioAbm(0,"",""),"","", "")

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
    private toastService: ToastService,
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
    if (!this.puedeEditarCliente) {
      return
    }
    this.tituloModal = "Editar cliente"
    this.setModalEditar(true)
  }

  setModalEditar(modal : boolean){
    this.modal = modal && this.puedeEditarCliente
  }

  get puedeEditarCliente(): boolean {
    return this.evento.id > 0
      && this.evento.cliente.id > 0
      && !this.evento.cliente.username?.trim()
  }

  async editCliente(cliente: ClienteUpdateDTO){
    if (!this.puedeEditarCliente) {
      this.setModalEditar(false)
      return
    }

    if (!cliente.id || cliente.id !== this.evento.cliente.id) {
      this.toastService.showError('No se pudo editar el cliente porque no se encontró un ID válido.')
      return
    }

    if (!cliente.nombre?.trim() || !cliente.apellido?.trim()) {
      this.toastService.showError('El nombre y el apellido son obligatorios.')
      return
    }

    if (cliente.celular !== null && !/^\d+$/.test(String(cliente.celular))) {
      this.toastService.showError('El teléfono debe contener sólo dígitos.')
      return
    }

    try {
      const clienteEdit = await this.usuarioService.saveCliente({
        id: cliente.id,
        nombre: cliente.nombre,
        apellido: cliente.apellido,
        email: cliente.email,
        celular: cliente.celular,
      })
      this.evento.cliente = clienteEdit
      this.cliente = clienteEdit.nombre + " " + clienteEdit.apellido
    } catch (error) {
      if (error instanceof HttpErrorResponse && error.status === 403) {
        this.toastService.showError('Este cliente tiene una cuenta registrada y no puede ser editado.')
        return
      }

      this.toastService.showError('No se pudo editar el cliente.')
      console.error('Error al editar el cliente', error)
    }
  }
}