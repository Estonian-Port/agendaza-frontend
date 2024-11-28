import { Component, HostListener, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AgendaService } from 'src/app/services/agenda.service';
import { Location } from '@angular/common';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent implements OnInit {
  constructor(private router: Router, private agendaService: AgendaService, private location: Location) {}

  //activeRoute: string = ''
  isSidebarActive: boolean = false
  selectedIcon : String = ""
  

  ngOnInit(): void{}   /*{
    // Subscribirse a los eventos de navegación para obtener la ruta activa
    this.router.events.pipe(
      filter((event: any) => event instanceof NavigationEnd) // Filtramos solo los eventos de tipo NavigationEnd
    ).subscribe((event: NavigationEnd) => {
      // Cuando se completa una navegación, actualizamos la ruta activa
      this.activeRoute = event.urlAfterRedirects; // Asignamos la URL después de cualquier redirección
    });
  }

  isActiveRoute(route: string): boolean {
    console.log(this.activeRoute )

    return this.activeRoute.includes(route); // Verificamos si la ruta activa contiene el ícono
  }*/



  isLogin(): boolean {
    return '/login' == this.location.path();
  }

  isAgendaSeleccionada(): boolean {
    return '' != this.agendaService.getEmpresaId();
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
    this.agendaService.removeEmpresaId();
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
