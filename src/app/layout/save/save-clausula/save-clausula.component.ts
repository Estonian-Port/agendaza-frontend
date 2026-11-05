import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { GenericItem } from 'src/app/model/GenericItem';
import { ClausulaService } from 'src/app/services/clausula.service';

@Component({
  selector: 'app-save-clausula',
  templateUrl: './save-clausula.component.html'
})
export class SaveClausulaComponent {
  
  genericItem : GenericItem = new GenericItem(0, "")

  constructor(
    private clausulaService : ClausulaService,
    private location : Location
  ) { }

  async save(){
    await this.clausulaService.save(this.genericItem)
    this.volver()
  }

  volver(){
    this.location.back()
  }
}

