import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-evento-seleccionado',
  templateUrl: './evento-seleccionado.component.html'
})
export class EventoSeleccionadoComponent {
  @Input() nombre = ''
  @Input() codigo = ''
  @Input() fechaInicio: string | Date = ''
  @Input() permitirCambiar = true
  @Output() outputCambiar = new EventEmitter<void>()
}