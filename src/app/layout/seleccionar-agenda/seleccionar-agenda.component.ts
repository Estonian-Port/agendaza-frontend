import { Component, OnInit } from "@angular/core"
import { AgendaCard } from "src/app/model/Agenda"
import { LoginService } from "src/app/services/login.service"
import { UsuarioService } from "src/app/services/usuario.service"
import { mostrarErrorConMensaje } from "src/util/errorHandler"

@Component({
  selector: 'app-seleccionar-agenda',
  templateUrl: './seleccionar-agenda.component.html',
})
export class SeleccionarAgendaComponent implements OnInit {

  listaAgenda: Array<AgendaCard> = []
  errors: string[] = [] 

  constructor(public usuarioService : UsuarioService, public logInService : LoginService) { }

  async ngOnInit(): Promise<void> {
    try {
      const usuarioId = this.logInService.getUsuarioId()
      
      if (!usuarioId) {
        console.log("No se pudo recuperar el ID del usuario logueado.")
      }
      
      this.listaAgenda = await this.usuarioService.getAllEmpresaByUsuarioId(usuarioId)
    } catch (error) {
      console.log(mostrarErrorConMensaje(this, error))
    }
  }
}