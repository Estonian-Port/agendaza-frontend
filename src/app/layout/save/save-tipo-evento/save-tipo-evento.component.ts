import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GenericItem } from 'src/app/model/GenericItem';
import { TipoEventoService } from 'src/app/services/tipo-evento.service';

@Component({
  selector: 'app-save-tipo-evento',
  templateUrl: './save-tipo-evento.component.html',
  styleUrls: ['./save-tipo-evento.component.css']
})
export class SaveTipoEventoComponent implements OnInit {
  
  genericItem : GenericItem = new GenericItem(0, "")


  constructor(private tipoEventoService : TipoEventoService, private router : Router) { }
  
  
  ngOnInit() {
  }

  async save(){
    const item = await this.tipoEventoService.saveTipoEvento(this.genericItem)
    this.router.navigateByUrl('/abmTipoEvento')
  }









  //TODO intento de form dinamico
  // myForm!: FormGroup
  // dynamicFormFields!: DynamicFormFieldModel[]

  // constructor(private fb: FormBuilder) {}

  // ngOnInit() {

  //   this.myForm = this.fb.group({})

  //   this.dynamicFormFields = [
  //     {
  //       id: 'nombre',
  //       label: 'Nombre',
  //       type: 'text'
  //     },      
  //     {
  //       id: 'duracion',
  //       label: 'Duracion',
  //       type: 'select'
  //     },
  //   ]


  //   this.dynamicFormFields.forEach(formItem => {
  //     this.myForm.addControl(formItem.id, this.fb.control(null))
  //   })

  // }

}
