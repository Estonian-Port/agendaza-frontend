import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DateUtil } from 'src/app/model/DateUtil';
import { EventoHora } from 'src/app/model/Evento';
import { Time } from 'src/app/model/Time';
import { EventoService } from 'src/app/services/evento.service';

@Component({
  selector: 'app-edit-evento-hora',
  templateUrl: './edit-evento-hora.component.html',
})
export class EditEventoHoraComponent implements OnInit {

  evento : EventoHora = new EventoHora(0,"","","","")
  inicio : Time = new Time("00","00")
  fin : Time = new Time("00","00")
  hastaElOtroDiaCheckbox : boolean = false

  fechaInicio : string = ""
  fechaFin : Date = new Date()

  constructor(private eventoService : EventoService, private router : Router) { }

  async ngOnInit() {
    this.evento = await this.eventoService.getEventoHora()

    this.inicio.hour = this.evento.inicio.split(":")[0].split("T")[1]
    this.inicio.minute = this.evento.inicio.split(":")[1]

    this.fin.hour = this.evento.fin.split(":")[0].split("T")[1]
    this.fin.minute = this.evento.fin.split(":")[1]
    
    this.fechaInicio = this.evento.inicio.split("T")[0]
    this.fechaFin = new Date(this.evento.fin)
  
    const [year, month, day] = this.fechaInicio.split('-').map(Number);
    const fechaInicioDate = new Date(year, month - 1, day);

    this.hastaElOtroDiaCheckbox = fechaInicioDate.getDate() < this.fechaFin.getDate()

  }

  changeHastaElOtroDiaCheckbox() {
    this.hastaElOtroDiaCheckbox = !this.hastaElOtroDiaCheckbox
  }

  volver(){
    this.router.navigateByUrl("/abmEvento")
  }

  async save(){

    const [year, month, day] = this.fechaInicio.split('-').map(Number);
    this.evento.inicio = new Date(year, month - 1, day, Number(this.inicio.hour) - 3, Number(this.inicio.minute)).toISOString();

    let fechaFinal = new Date(year, month - 1, day, Number(this.fin.hour) - 3, Number(this.fin.minute));
    
    console.log(this.hastaElOtroDiaCheckbox)
    if (this.hastaElOtroDiaCheckbox) {
      fechaFinal.setDate(fechaFinal.getDate() + 1);
    }
    this.evento.fin = fechaFinal.toISOString();

    await this.eventoService.editEventoHora(this.evento)
    this.router.navigateByUrl("/abmEvento")
  }

}
