import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import * as _ from 'lodash';
import { GenericItem } from 'src/app/model/GenericItem';

@Component({
  selector: 'app-extra-checkbox',
  templateUrl: './extra-checkbox.component.html',
  styleUrls: ['./extra-checkbox.component.css']
})
export class ExtraCheckboxComponent implements OnInit {

  @Input()
  i! : number

  @Input()
  extra! : GenericItem

  @Input()
  listaExtra! : Array<number>

  constructor() { }

  ngOnInit(): void {
  }

  onCheckboxChange(event: any){
    if (event.target.checked) {
      this.listaExtra.push( Number(event.target.value))
    } else {
      _.pull(this.listaExtra, Number(event.target.value))
    }
  }
}
