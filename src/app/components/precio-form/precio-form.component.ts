import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ListaMes, Mes } from 'src/app/model/Mes';
import { PrecioForm } from 'src/app/model/Precio';

@Component({
  selector: 'app-precio-form',
  templateUrl: './precio-form.component.html',
  styleUrls: ['./precio-form.component.css']
})
export class PrecioFormComponent implements OnInit {

  @Input()
  precio! : PrecioForm

  @Input()
  i! : number

  @Output() 
  outputQuitarPrecio = new EventEmitter<number>();
  
  currentYear = new Date().getFullYear()
  listaYear : Array<number> = [this.currentYear, this.currentYear + 1]
  listaMes : Array<Mes> = ListaMes

  constructor() { }

  ngOnInit(): void {
  }

  quitarPrecio(id : number){
    this.outputQuitarPrecio.emit(id);
  }

}
