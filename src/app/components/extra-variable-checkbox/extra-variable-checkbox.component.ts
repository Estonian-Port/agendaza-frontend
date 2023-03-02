import { Component, Input, OnInit } from '@angular/core';
import * as _ from 'lodash';
import { ExtraVariable } from 'src/app/model/ExtraVariable';

@Component({
  selector: 'app-extra-variable-checkbox',
  templateUrl: './extra-variable-checkbox.component.html',
  styleUrls: ['./extra-variable-checkbox.component.css']
})
export class ExtraVariableCheckboxComponent implements OnInit {

  @Input()
  i! : number

  @Input()
  extra! : ExtraVariable

  @Input()
  listaExtra! : Array<ExtraVariable>

  input : boolean = true
  
  constructor() { }

  ngOnInit(): void {
    this.extra.cantidad = 0
  }

  onCheckboxChange(event: any){
    if (event.target.checked) {
      this.listaExtra.push(this.extra)
      this.input = false
    } else {
      this.extra.cantidad = 0
      _.pull(this.listaExtra, this.extra)
      this.input = true
    }
  }

}