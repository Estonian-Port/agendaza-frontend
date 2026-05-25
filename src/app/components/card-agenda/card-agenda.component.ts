import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AgendaCard } from 'src/app/model/Agenda';
import { LoginService } from 'src/app/services/login.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-card-agenda',
  templateUrl: './card-agenda.component.html'
})
export class CardAgendaComponent implements OnInit {

  @Input() agenda! : AgendaCard

  constructor(private usuarioService : UsuarioService, private loginService : LoginService, private router : Router) { }

  ngOnInit(): void {
  }

  selecionarAgenda(agendaId : number){
    this.usuarioService.setEmpresaId(agendaId)
    this.loginService.setCargo()

    this.router.navigateByUrl('/agenda')
  }

}
