import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent {

  @Input()
  botonSave = false

  @Input()
  botonAgregar = false
  
  @Input()
  botonDescargar = false
  
  @Input()
  botonEmail = false

  @Input()
  botonCambiarContrasenia = false

  @Input()
  titulo = ""

  @Output()
  outputVolver = new EventEmitter()

  @Output()
  outputSave = new EventEmitter()

  @Output()
  outputAgregar = new EventEmitter()

  @Output()
  outputDescargar = new EventEmitter()

  @Output()
  outputEnviarMail = new EventEmitter()

  @Output()
  outputCambiarContrasenia = new EventEmitter()

  volver() {
    this.outputVolver.emit()
  }
    
  save() {
    this.outputSave.emit()
  }
    
  agregar() {
    this.outputAgregar.emit()
  }

  descargar(){
    this.outputDescargar.emit()
  }

  enviarEmail(){
    this.outputEnviarMail.emit()
  }

  cambiarContrasenia(){
    this.outputCambiarContrasenia.emit()
  }

}
