import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AgregadosEdit } from 'src/app/model/Agregados';
import { EventoExtra } from 'src/app/model/Evento';
import { EventoService } from 'src/app/services/evento.service';

@Component({
  selector: 'app-edit-evento-extras',
  templateUrl: './edit-evento-extras.component.html',
  styleUrls: ['./edit-evento-extras.component.css']
})
export class EditEventoExtrasComponent implements OnInit {

  eventoExtra : EventoExtra = new EventoExtra(0, "","",0,new AgregadosEdit(0,0,0,[],[]))

  constructor(private eventoService : EventoService, private router : Router) { }

  async ngOnInit() {
    this.eventoExtra = await this.eventoService.getEventoExtra()
  }

  volver(){
    this.router.navigateByUrl("/abmEvento")
  }
}
