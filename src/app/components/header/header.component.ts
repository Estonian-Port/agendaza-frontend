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
  titulo = ""

  @Output()
  outputVolver = new EventEmitter<number>();

  @Output()
  outputSave = new EventEmitter();

  @Output()
  outputAgregar = new EventEmitter<number>();

  constructor() { }

  volver() {
    this.outputVolver.emit()
  }
    
  save() {
    this.outputSave.emit()
  }
    
  agregar() {
    this.outputAgregar.emit()
  }

}
