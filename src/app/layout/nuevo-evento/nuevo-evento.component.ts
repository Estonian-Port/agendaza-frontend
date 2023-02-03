import { Component, OnInit } from '@angular/core';
import { GenericItem } from 'src/app/model/GenericItem';


@Component({
  selector: 'app-nuevo-evento',
  templateUrl: './nuevo-evento.component.html',
  styleUrls: ['./nuevo-evento.component.css']
})
export class NuevoEventoComponent implements OnInit {
  
  step : number = 1
  listaStepBox : Array<GenericItem> = [
    {
        id : 1,
        nombre : "Tipo de evento"
    },
    {
        id : 2,
        nombre : "Datos del evento"
    },
    {
        id : 3,
        nombre : "Cotizacion"
    },
    {
        id : 4,
        nombre : "Catering"
    },
    {
        id : 5,
        nombre : "Datos de contacto"
    },
]

  ngOnInit(): void {
    this.step = 1
  }
  
  isStep(step : number) : boolean{
    return this.step == step
  }

  get myIsStep() {
    return this.isStep.bind(this);
  }

  siguiente(){
    if(this.step >= 1 && this.step < 5){
      this.step = this.step + 1
    }
  }

  atras(){
    if(this.step > 1 && this.step <= 5){
      this.step = this.step - 1
    }
  }

}
