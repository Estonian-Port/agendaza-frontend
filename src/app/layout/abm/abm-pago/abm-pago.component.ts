import { Component, OnInit } from '@angular/core';
import { PagoService } from 'src/app/services/pago.service';

@Component({
  selector: 'app-abm-pago',
  templateUrl: './abm-pago.component.html',
})
export class AbmPagoComponent implements OnInit {

  buscar = ''
  listaItems : Array<any> = []
  cantidadRegistros : number=0
  cantidadPaginas : number[] = []
  paginaActual : number = 0
  realizoBusqueda : Boolean = true

  constructor(private pagoService : PagoService) { }

  async ngOnInit(): Promise<void> {
    this.inicializarListaItems()
  }

  async inicializarListaItems(){

    this.updatePalabraBuscar(this.buscar)
    this.paginaCero()
    
    if(this.buscar == ""){
      this.listaItems = await this.pagoService.getAllPagoByEmpresaId(this.paginaActual)
      this.cantidadRegistros = await this.pagoService.cantPagos()
    }else{
      this.listaItems = await this.pagoService.getAllPagoByFilter(this.paginaActual,this.buscar)
      this.cantidadRegistros = await this.pagoService.cantPagosFiltrados(this.buscar)
    }

    this.cantidadPaginas = new Array<number>(Math.ceil(this.cantidadRegistros / 10))
    this.updateCantidadPaginas(this.cantidadPaginas)
  }

  paginaCero(){
    if(this.realizoBusqueda){
      this.paginaActual = 0
    }
    this.realizoBusqueda = false
  }

  updatePaginaActual(page : number){
    this.paginaActual = page
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
    (await this.pagoService.delete(id)).subscribe({
      complete: () => {
        this.inicializarListaItems()
      }
    })
  }

  async descargar(id: number) {
    const blob = await this.pagoService.generarComprobanteDePago(id)
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = 'estado_cuenta.pdf';
    link.click();
    link.remove();
  } catch (error: any) {
    console.error('Error al descargar el PDF:', error);
  }
}
