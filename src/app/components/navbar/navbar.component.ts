import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AgendaService } from 'src/app/services/agenda.service';
import { Location } from '@angular/common';
import { LoginService } from 'src/app/services/login.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {

  constructor(private loginService: LoginService, private usuarioService : UsuarioService, private router: Router, private agendaService: AgendaService, private location: Location) { }

  dropdownVisible : boolean = false;

  @ViewChild('dropdownMenu') 
  dropdownMenu!: ElementRef;

  isLogin(): boolean {
    return "/login" == this.location.path()
  }

  volverCalendario() {
    this.router.navigateByUrl('/agenda')
  }

  logout() {
    this.loginService.logout()
    this.dropdownVisible = false
    this.router.navigateByUrl('/login')
  }

  perfil() {
    this.usuarioService.perfilVolver = this.location.path()
    this.dropdownVisible = false
    this.router.navigateByUrl('/editUsuarioPerfil')
  }

  empresa(){
    this.dropdownVisible = false
    this.router.navigateByUrl('/abmEmpresa')
  }

  toggleDropdown(event: MouseEvent) {
    event.stopPropagation();
    this.dropdownVisible = !this.dropdownVisible
  }

  @HostListener('document:click', ['$event'])
  clickOutside(event: MouseEvent) {
    if (this.dropdownVisible &&
      !this.dropdownMenu.nativeElement.contains(event.target)) {
      this.dropdownVisible = false
    }
  }
}
