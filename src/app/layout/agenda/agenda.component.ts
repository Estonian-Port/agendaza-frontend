import { Component, Input, OnInit } from '@angular/core';
import { CalendarOptions, EventInput } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import bootstrap5Plugin from '@fullcalendar/bootstrap5';
import esLocale from '@fullcalendar/core/locales/es';
import { mostrarErrorConMensaje } from 'src/util/errorHandler';
import { AgendaService } from 'src/app/services/agenda.service';

@Component({
  selector: 'app-agenda',
  templateUrl: './agenda.component.html',
  styleUrls: ['./agenda.component.css']
})
export class AgendaComponent implements OnInit {

  constructor(private agendaService : AgendaService) { }

  eventos: EventInput[] = []

  calendarOptions: CalendarOptions = {
    plugins: [
      dayGridPlugin,
      timeGridPlugin,
      listPlugin,
      bootstrap5Plugin 
    ],
    themeSystem: 'bootstrap5',
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,listWeek'
    },
    initialView: 'dayGridMonth',
    locale: 'es',
    locales : [esLocale]
  }

  async ngOnInit() {
    try {
      this.eventos = await this.agendaService.getAllEventosByEmpresaId(this.agendaService.getAgendaId())
      console.log(this.eventos)
      
      this.calendarOptions.events = this.eventos

    } catch (error) {
      mostrarErrorConMensaje(this, error)
    }
  }

}
