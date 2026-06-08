import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GenericItem } from 'src/app/model/GenericItem';
import { ClausulaService } from 'src/app/services/clausula.service';

@Component({
  selector: 'app-save-clausula',
  templateUrl: './save-clausula.component.html'
})
export class SaveClausulaComponent {
  
  genericItem : GenericItem = new GenericItem(0, "")
  listaClausula : Array<GenericItem> = []
  otro = false
  edicion = false
  clausulaId : number = 0

  constructor(
    private clausulaService : ClausulaService,
    private location : Location,
    private route: ActivatedRoute,
    
  ) { }
  
  async ngOnInit(): Promise<void> {
    await this.route.queryParams.subscribe(async params => {
      if (params['clausulaId']) {
        const clausulaId = Number(params['clausulaId']);
        this.genericItem = await this.clausulaService.get(clausulaId)
        this.otro = true
      }else{
        this.listaClausula = await this.clausulaService.getAllAgregar()
        if(this.listaClausula.length == 0){
          this.genericItem.id = 0
          this.onServicioChange()
        }else{
          const clausulaEdicio = [...this.listaClausula].sort((a, b) => a.nombre.localeCompare(b.nombre))[0];

          this.genericItem.id = clausulaEdicio.id
          this.genericItem.nombre = clausulaEdicio.nombre
        }
      }
    })
  }

  async save(){
    const item = await this.clausulaService.save(this.genericItem)
    this.volver()
  }

  volver(){
    this.location.back()
  }

  onServicioChange(): void {
    if (this.genericItem.id == 0) {
        this.genericItem = new GenericItem(0, "")
        this.otro = true;
    } else {
        this.otro = false;
    }
  }
  
}

