import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent implements OnInit {
  constructor(private router: Router, private usuarioService: UsuarioService, private location: Location) {}

  isSidebarActive: boolean = false
  selectedIcon : String = ""
  

  ngOnInit(): void{}


  isLogin(): boolean {
    return '/login' == this.location.path();
  }

  isAgendaSeleccionada(): boolean {
    return this.usuarioService.isAgendaSeleccionada();
  }

  isInSeleccionarAgenda(): boolean {
    return '' == this.location.path();
  }

  isInAgenda(): boolean {
    return '/agenda'  == this.location.path();
  }

  isSaveEvento(): boolean {
    return '/saveEvento' == this.location.path();
  }

  isPanelAdmin(): boolean {
    return '/panelAdmin' == this.location.path();
  }

  isAbm(): boolean {
    return '/abm' == this.location.path().substring(0, 4);
  }

  irAgendas() {
    this.usuarioService.removeEmpresaId();
    this.router.navigateByUrl('/');
  }

  irCalendario() {
    this.router.navigateByUrl('/agenda');
  }

  irSaveEvento() {

    this.router.navigateByUrl('/saveEvento');
  }

  irPanelAdmin() {
    this.router.navigateByUrl('/panelAdmin');
  }

  toggleSidebar() {
    this.isSidebarActive = !this.isSidebarActive;
  }

  isSelectedIcon(iconName: string): boolean {
    return this.selectedIcon == iconName;
  }

  @HostListener('document:click', ['$event'])
  clickOutside(event: Event) {
    if (this.isSidebarActive) {
      const target = event.target as HTMLElement;
      if (!target.closest('#sidebar') && !target.closest('.sidebar-collapsed-toggle')) {
        this.isSidebarActive = false;
      }
    }
  }
}
