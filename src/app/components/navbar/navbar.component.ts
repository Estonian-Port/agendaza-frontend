import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AgendaService } from 'src/app/services/agenda.service';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor(private loginService: LoginService, private router : Router, private agendaService : AgendaService) { }

  ngOnInit(): void {
  }

  logout(){
    this.loginService.logout()
    this.router.navigateByUrl('/login')
  }

  nuevoEvento(){
    this.router.navigateByUrl('/nuevoEvento')
  }

  volverAgendas(){
    this.agendaService.removeAgendaId()
    this.router.navigateByUrl('/')
  }

  isAgenda(): boolean {
    return this.agendaService.getAgendaId() != ""
  }

  isLogin(): boolean{
    return this.loginService.getToken() != null
  }

}
