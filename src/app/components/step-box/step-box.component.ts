import { Component, Input, OnInit } from '@angular/core';
import { NuevoEventoComponent } from 'src/app/layout/nuevo-evento/nuevo-evento.component';
import { GenericItem } from 'src/app/model/GenericItem';
import { StepBox } from 'src/app/model/StepBox';

@Component({
  selector: 'app-step-box',
  templateUrl: './step-box.component.html',
  styleUrls: ['./step-box.component.css']
})
export class StepBoxComponent implements OnInit {

  @Input()
  stepBox! : GenericItem
  
  @Input()
  currentStep!: number; 

  constructor() { }

  ngOnInit(): void {
  }

  isStep(id :number){
    return this.currentStep == id
  }
}