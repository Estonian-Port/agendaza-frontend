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
  botonAgregarSecundario = false
  
  @Input()
  botonDescargar = false
  
  @Input()
  botonEmail = false

  @Input()
  descargaEnCurso = false

  @Input()
  emailEnCurso = false

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
  outputAgregarSecundario = new EventEmitter()

  @Output()
  outputDescargar = new EventEmitter()

  @Output()
  outputEnviarEmail = new EventEmitter()

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

  agregarSecundario() {
    this.outputAgregarSecundario.emit()
  }

  descargar(){
    this.outputDescargar.emit()
  }

  enviarEmail(){
    this.outputEnviarEmail.emit()
  }

  cambiarContrasenia(){
    this.outputCambiarContrasenia.emit()
  }

}
