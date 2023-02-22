import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Capacidad } from 'src/app/model/Capacidad';
import { TipoEvento } from 'src/app/model/TipoEvento';
import { TipoEventoService } from 'src/app/services/tipo-evento.service';

@Component({
  selector: 'app-save-tipo-evento',
  templateUrl: './save-tipo-evento.component.html',
  styleUrls: ['./save-tipo-evento.component.css']
})
export class SaveTipoEventoComponent implements OnInit {
  
  tipoEvento : TipoEvento = new TipoEvento(0,"","","CORTO",new Capacidad(0,0,0), 0)
  listaDuracion : Array<string> = []

  constructor(private tipoEventoService : TipoEventoService, private router : Router) { }
  
  async ngOnInit() {
    if(this.tipoEventoService.tipoEventoId){
      this.tipoEvento = await this.tipoEventoService.getTipoEvento(this.tipoEventoService.tipoEventoId)
      console.log(this.tipoEvento)

    }

    this.listaDuracion = await this.tipoEventoService.getAllDuracion()
  }

  async save(){
    const item = await this.tipoEventoService.save(this.tipoEvento)
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
