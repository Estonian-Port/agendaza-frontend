import { Component } from '@angular/core';
import { Router } from '@angular/router';
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

  constructor(private clausulaService : ClausulaService, private router : Router) { }
  
  async ngOnInit(): Promise<void> {

    if(this.clausulaService.clausulaId){
      this.genericItem = await this.clausulaService.get(this.clausulaService.clausulaId)
      this.clausulaService.clausulaId = 0
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
  }

  async save(){
    const item = await this.clausulaService.save(this.genericItem)
    this.router.navigateByUrl('/abmClausula')
  }

  volver(){
    this.router.navigateByUrl('/abmClausula')
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

