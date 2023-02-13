import { Component, OnInit } from '@angular/core';
import { ServicioService } from 'src/app/services/servicio.service';

@Component({
  selector: 'app-save-servicio',
  templateUrl: './save-servicio.component.html',
  styleUrls: ['./save-servicio.component.css']
})
export class SaveServicioComponent implements OnInit {

  constructor(private servicioService : ServicioService) { }

  ngOnInit(): void {
  }

}
