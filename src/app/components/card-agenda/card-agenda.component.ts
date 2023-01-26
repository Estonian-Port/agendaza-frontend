import { Component, Input, OnInit } from '@angular/core';
import { AgendaCard } from 'src/app/model/Agenda';

@Component({
  selector: 'app-card-agenda',
  templateUrl: './card-agenda.component.html',
  styleUrls: ['./card-agenda.component.css']
})
export class CardAgendaComponent implements OnInit {

  @Input() agenda! : AgendaCard

  constructor() { }

  ngOnInit(): void {
  }

}
