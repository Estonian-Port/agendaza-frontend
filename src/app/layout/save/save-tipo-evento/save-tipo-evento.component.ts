import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DynamicFormFieldModel } from 'src/app/model/DynamicFormFieldModel';

@Component({
  selector: 'app-save-tipo-evento',
  templateUrl: './save-tipo-evento.component.html',
  styleUrls: ['./save-tipo-evento.component.css']
})
export class SaveTipoEventoComponent implements OnInit {
  ngOnInit(): void {
    throw new Error('Method not implemented.');
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
