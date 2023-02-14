import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { DynamicFormFieldModel } from 'src/app/model/DynamicFormFieldModel';
import { GenericItem } from 'src/app/model/GenericItem';
import { ServicioService } from 'src/app/services/servicio.service';
import { TipoEventoService } from 'src/app/services/tipo-evento.service';

@Component({
  selector: 'app-save-servicio',
  templateUrl: './save-servicio.component.html',
  styleUrls: ['./save-servicio.component.css']
})
export class SaveServicioComponent implements OnInit {
  
  genericItem : GenericItem = new GenericItem(0, "")
  listaItems : Array<GenericItem> = []

  constructor(private servicioService : ServicioService, private tipoEventoService : TipoEventoService, private router : Router) { }
  
  
  async ngOnInit(): Promise<void> {

    this.listaItems = await this.tipoEventoService.getAllTipoEventoByEmpresaId()

  }

  async save(){
    const a = await this.servicioService.saveServicio(this.genericItem)
    this.router.navigateByUrl('/abmServicio')
  }


}
