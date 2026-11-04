import { Component, OnInit } from "@angular/core"
import { HttpErrorResponse } from "@angular/common/http"
import { Router } from "@angular/router"
import { AgendaCard } from "src/app/model/Agenda"
import { LoginService } from "src/app/services/login.service"
import { ToastService } from "src/app/services/toast.service"
import { UsuarioService } from "src/app/services/usuario.service"
import { mostrarErrorConMensaje } from "src/util/errorHandler"

@Component({
  selector: 'app-seleccionar-agenda',
  templateUrl: './seleccionar-agenda.component.html',
})
export class SeleccionarAgendaComponent implements OnInit {

  listaAgenda: Array<AgendaCard> = []

  constructor(
    private loginService: LoginService,
    private usuarioService: UsuarioService,
    private toastService: ToastService,
    private router: Router
  ) {}

  async ngOnInit(): Promise<void> {
    try {
      const usuarioId = this.loginService.getUsuarioId()
      this.listaAgenda = await this.usuarioService.getAllEmpresaByUsuarioId(usuarioId)

      if (this.listaAgenda.length === 1) {
        this.usuarioService.setEmpresaId(this.listaAgenda[0].id)
        await this.loginService.setCargo()
        this.router.navigateByUrl('/agenda')
      }
    } catch (error) {
      if (error instanceof HttpErrorResponse && error.error?.code === 'ONBOARDING_REQUIRED') {
        return
      }

      if (!(error instanceof HttpErrorResponse)) {
        this.toastService.showError(mostrarErrorConMensaje(this, error))
      }
      this.loginService.logout()
      this.router.navigateByUrl('/login')
    }
  }
}