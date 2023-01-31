import { Component, OnInit } from '@angular/core';
import { List } from 'lodash';
import { StepBox } from 'src/app/model/StepBox';


@Component({
  selector: 'app-nuevo-evento',
  templateUrl: './nuevo-evento.component.html',
  styleUrls: ['./nuevo-evento.component.css']
})
export class NuevoEventoComponent implements OnInit {
  
  step : number = 1
  listaStepBox : Array<StepBox> = [
    {
        id : 1,
        titulo : "Tipo de evento"
    },
    {
        id : 2,
        titulo : "Datos del evento"
    },
    {
        id : 3,
        titulo : "Cotizacion"
    },
    {
        id : 4,
        titulo : "Catering"
    },
    {
        id : 5,
        titulo : "Datos de contacto"
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
