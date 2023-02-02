import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AgendaService } from 'src/app/services/agenda.service';
import { LoginService } from 'src/app/services/login.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor(private loginService: LoginService, private router : Router, private agendaService : AgendaService, private location: Location) { }

  ngOnInit(): void {}

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
    return "/agenda" == this.location.path()
  }

  isLogin(): boolean{
    return this.loginService.getToken() != null
  }

  isInAgenda(): boolean{
    return this.agendaService.getAgendaId() != ""
  }

  isNuevoEvento() : boolean{
    return "/nuevoEvento" == this.location.path()
  }

  isConfiguracion() : boolean{
    return "/configuracion" == this.location.path()
  }

  isAbm() : boolean{
    return "/Abm/**" == this.location.path()
  }

  volverCalendario(){
    this.router.navigateByUrl('/agenda')
  }

  configuracion(){
    this.router.navigateByUrl('/configuracion')
  }
}
