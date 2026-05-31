import { Component, OnInit } from '@angular/core';
import { Capacidad } from 'src/app/model/Capacidad';
import { EventoVer } from 'src/app/model/Evento';
import { Cliente, UsuarioAbm} from 'src/app/model/Usuario';
import { Router, ActivatedRoute } from '@angular/router'; // 1. Agregamos ActivatedRoute
import { Location } from '@angular/common'; // 2. Agregamos Location
import { EventoService } from 'src/app/services/evento.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-ver-cliente',
  templateUrl: './ver-cliente.component.html',
})
export class VerClienteComponent implements OnInit {

  evento : EventoVer = new EventoVer(0,"", "","","", "",new Capacidad(0,0,0),0,
  0,[],[],"",[],[], new Cliente(0,"","","","",0),0, new UsuarioAbm(0,"",""),"","", "")

  cliente = ""
  eventos: Array<any> = []
  cantidadEventos = 0
  modal = false
  tituloModal=""

  constructor(
    private eventoService : EventoService, 
    private usuarioService: UsuarioService, 
    private router : Router,
    private route: ActivatedRoute, // Inyectado
    private location: Location     // Inyectado
  ) { }

  ngOnInit() {
    // 3. Nos suscribimos a los parámetros de la URL para obtener el eventoId
    this.route.queryParams.subscribe(async params => {
      if (params['eventoId']) {
        const eventoId = Number(params['eventoId']);
        
        // 4. Ahora sí, le pasamos el ID explícito al servicio
        this.evento = await this.eventoService.getEventoVer(eventoId);
        
        this.eventos = await this.usuarioService.getEventosByUsuarioAndEmpresa(this.evento.cliente.id);
        this.cantidadEventos = await this.usuarioService.getCantEventosByUsuarioAndEmpresa(this.evento.cliente.id);

        this.cliente = this.evento.cliente.nombre + " " + this.evento.cliente.apellido;
      }
    });
  }

  volver(eventoId: number){
    // OPCIÓN A: Navegar explícitamente a la ruta de ver evento que configuramos antes
    this.router.navigate(['/verEvento', eventoId]);
    
    // OPCIÓN B: Simplemente retroceder en el historial (descomentar si prefieres esta)
    // this.location.back();
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