import { Component, OnInit, ViewChild } from '@angular/core';
import { CalendarOptions, EventInput } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import bootstrap5Plugin from '@fullcalendar/bootstrap5';
import esLocale from '@fullcalendar/core/locales/es';
import { mostrarErrorConMensaje } from 'src/util/errorHandler';
import interactionPlugin from '@fullcalendar/interaction';
import { Router } from '@angular/router';
import { EventoService } from 'src/app/services/evento.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-agenda',
  templateUrl: './agenda.component.html',
  styleUrls: ['./agenda.component.css'],
})
export class AgendaComponent implements OnInit {
  constructor(private usuarioService: UsuarioService, private router: Router, private eventoService: EventoService) {}

  eventos: EventInput[] = [];

  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, timeGridPlugin, listPlugin, bootstrap5Plugin, interactionPlugin],
    dateClick: this.handleDateClick.bind(this),
    themeSystem: 'bootstrap5',
    headerToolbar: {
      left: 'prev,next',
      center: 'title',
      right: 'dayGridMonth,listWeek',
    },
    initialView: 'dayGridMonth',
    locale: 'es',
    locales: [esLocale],
  };

  async ngOnInit() {
    try {
      this.eventos = await this.eventoService.getAllEventosForAgendaByEmpresaId()

      this.calendarOptions.events = this.eventos;
    } catch (error) {
      mostrarErrorConMensaje(this, error);
    }
  }

  handleDateClick(arg: { dateStr: string }) {
    this.eventoService.fechaFiltroForAbmEvento = arg.dateStr;
    this.router.navigateByUrl('/abmEvento');
  }
}
