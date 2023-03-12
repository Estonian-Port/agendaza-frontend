import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CateringEvento, CateringEventoEdit } from 'src/app/model/CateringEvento';
import { EventoCatering } from 'src/app/model/Evento';
import { EventoService } from 'src/app/services/evento.service';

@Component({
  selector: 'app-edit-evento-catering',
  templateUrl: './edit-evento-catering.component.html',
  styleUrls: ['./edit-evento-catering.component.css']
})
export class EditEventoCateringComponent implements OnInit {

  eventoCatering : EventoCatering = new EventoCatering(0, "","",new CateringEventoEdit(0,0,0,"",[],[]))

  constructor(private eventoService : EventoService, private router : Router) { }

  async ngOnInit() {
    this.eventoCatering = await this.eventoService.getEventoCatering()
  }

  volver(){
    this.router.navigateByUrl("/abmEvento")
  }

}
