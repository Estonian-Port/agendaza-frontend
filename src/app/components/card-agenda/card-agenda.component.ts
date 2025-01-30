import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AgendaCard } from 'src/app/model/Agenda';
import { AgendaService } from 'src/app/services/agenda.service';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-card-agenda',
  templateUrl: './card-agenda.component.html'
})
export class CardAgendaComponent implements OnInit {

  @Input() agenda! : AgendaCard

  constructor(private agendaService : AgendaService, private loginService : LoginService, private router : Router) { }

  ngOnInit(): void {
  }

  selecionarAgenda(agendaId : number){
    this.agendaService.setEmpresaId(agendaId)
    this.loginService.setCargo()

    this.router.navigateByUrl('/agenda')
  }

}
