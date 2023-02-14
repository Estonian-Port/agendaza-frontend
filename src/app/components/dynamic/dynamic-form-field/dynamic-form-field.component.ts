import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormGroupDirective } from '@angular/forms';
import { DynamicFormFieldModel } from 'src/app/model/DynamicFormFieldModel';

@Component({
  selector: 'app-dynamic-form-field',
  templateUrl: './dynamic-form-field.component.html',
  styleUrls: ['./dynamic-form-field.component.css']
})
export class DynamicFormFieldComponent {

  @Input() formItem!: DynamicFormFieldModel

  form!: FormGroup

  constructor(private rootFormGroup: FormGroupDirective) {
    this.form = this.rootFormGroup.control
  }

}
