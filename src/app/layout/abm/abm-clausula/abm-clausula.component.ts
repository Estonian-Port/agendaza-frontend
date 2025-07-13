import { Component } from '@angular/core'
import { Router } from '@angular/router'
import { ClausulaService } from 'src/app/services/clausula.service'
import { Location } from '@angular/common'

@Component({
  selector: 'app-abm-clausula',
  templateUrl: './abm-clausula.component.html'
})
export class AbmClausulaComponent {

  buscar = ''
  listaItems : Array<any> = []
  cantidadRegistros : number=0
  paginaActual : number = 0
  cantidadPaginas : number[] = []
  realizoBusqueda : Boolean = true

  nombreItemModal = ""
  tituloModal = ""
  botonModal = ""


  constructor(private clasulaService : ClausulaService, private router : Router, private location : Location) { }

  async ngOnInit(): Promise<void> {
    this.inicializarListaItems()
  }

  async inicializarListaItems(){
    this.updatePalabraBuscar(this.buscar)
    this.paginaCero()

    if(this.buscar == ""){
      this.listaItems = await this.clasulaService.getAll(this.paginaActual)
      this.cantidadRegistros = await this.clasulaService.getAllCantidad()
    }else{
      this.listaItems = await this.clasulaService.getAllFiltro(this.paginaActual,this.buscar)
      this.cantidadRegistros = await this.clasulaService.getAllFiltroCantidad(this.buscar)
    }

    this.cantidadPaginas = new Array<number>(Math.ceil(this.cantidadRegistros / 10))
    
    this.tituloModal = "Eliminar Clausula"
    this.nombreItemModal = "clausula"
    this.botonModal = "Eliminar"
  }

  paginaCero(){
    if(this.realizoBusqueda){
      this.paginaActual = 0
    }
    this.realizoBusqueda = false
  }

  updatePaginaActual(pagina : number){
    this.paginaActual = pagina
    this.inicializarListaItems()
  }

  updatePrimeraBusqueda(busqueda: Boolean){
    this.realizoBusqueda = busqueda
  }

  updatePalabraBuscar(palabraBuscar: string){
    this.buscar = palabraBuscar
  }

  updateCantidadPaginas(cantidadPaginas: number[]){
    this.cantidadPaginas = cantidadPaginas
  }

  async eliminar(id : number){
    (await this.clasulaService.delete(id)).subscribe({
      complete: () => {
        this.inicializarListaItems()
      }
    })
  }

}
