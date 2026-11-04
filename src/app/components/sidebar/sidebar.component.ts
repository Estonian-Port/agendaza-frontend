import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Location } from '@angular/common';
import { UsuarioService } from 'src/app/services/usuario.service';
import { LoginService } from 'src/app/services/login.service';
import { Subscription, filter } from 'rxjs';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent implements OnInit, OnDestroy {
  constructor(private router: Router, private usuarioService: UsuarioService, private location: Location, private loginService: LoginService) {}

  isSidebarActive: boolean = false
  mostrarBotonAgendas = false
  selectedIcon : String = ""
  private usuarioIdAgendas: number | null = null
  private cargandoAgendas = false
  private routerSubscription = new Subscription()

  ngOnInit(): void {
    this.actualizarBotonAgendas()
    this.routerSubscription = this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe(() => this.actualizarBotonAgendas())
  }

  ngOnDestroy(): void {
    this.routerSubscription.unsubscribe()
  }

  private async actualizarBotonAgendas(): Promise<void> {
    if (this.isLogin() || this.isOnboardingFlow() || this.cargandoAgendas) return

    const usuarioId = this.loginService.getUsuarioId()
    if (usuarioId === this.usuarioIdAgendas) return

    this.cargandoAgendas = true
    try {
      const agendas = await this.usuarioService.getAllEmpresaByUsuarioId(usuarioId)
      this.mostrarBotonAgendas = agendas.length > 1
      this.usuarioIdAgendas = usuarioId
    } catch (error) {
      console.error('Error al verificar las agendas del usuario', error)
    } finally {
      this.cargandoAgendas = false
    }
  }


  isLogin(): boolean {
    return '/login' == this.location.path();
  }

  isOnboardingFlow(): boolean {
    return ['/completar-perfil', '/cambiar-password'].includes(this.location.path().split('?')[0]);
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

  closeSidebar() {
    this.isSidebarActive = false;
  }

  isSelectedIcon(iconName: string): boolean {
    return this.selectedIcon == iconName;
  }

  @HostListener('document:click', ['$event'])
  clickOutside(event: Event) {
    if (this.isSidebarActive) {
      const target = event.target as HTMLElement;
      if (!target.closest('#sidebar') &&
        !target.closest('.sidebar-collapsed-toggle') &&
        !target.closest('.mobile-sidebar-toggle')) {
        this.isSidebarActive = false;
      }
    }
  }
}
