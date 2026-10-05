import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { Pago, ResumenPagosMes } from 'src/app/model/Pago';
import { PagoService } from 'src/app/services/pago.service';

@Component({
  selector: 'app-abm-pago',
  templateUrl: './abm-pago.component.html',
})
export class AbmPagoComponent implements OnInit {

  private readonly MESES = ['Enero','Febrero','Marzo','Abril','Mayo','Junio',
    'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre']

  hoy = new Date()
  mes = this.hoy.getMonth() + 1
  anio = this.hoy.getFullYear()

  listaPago: Array<Pago> = []
  resumen: ResumenPagosMes = { ingresos: 0, egresos: 0, balance: 0, cantidadPagos: 0, totalPagos: 0 }
  cargando = false
  private requestId = 0   // evita que una respuesta vieja pise a una nueva si se clickea rápido

  modal = false
  idEliminar = 0
  cuerpoModal = ""
  tituloModal = ""
  botonModal = ""

  constructor(
    private pagoService: PagoService,
    private router: Router,
    private location: Location
  ) { }

  async ngOnInit() {
    await this.cargarMes()
  }

  get nombreMes(): string {
    return `${this.MESES[this.mes - 1]} ${this.anio}`
  }

  get esMesActual(): boolean {
    return this.mes === this.hoy.getMonth() + 1 && this.anio === this.hoy.getFullYear()
  }

  async mesAnterior() {
    if (this.mes === 1) { this.mes = 12; this.anio-- } else { this.mes-- }
    await this.cargarMes()
  }

  async mesSiguiente() {
    if (this.esMesActual) return
    if (this.mes === 12) { this.mes = 1; this.anio++ } else { this.mes++ }
    await this.cargarMes()
  }

  async cargarMes() {
    const id = ++this.requestId
    this.cargando = true
    try {
      const [resumen, pagos] = await Promise.all([
        this.pagoService.getResumenPagosMes(this.mes, this.anio),
        this.pagoService.getAllPagoByMes(this.mes, this.anio)
      ])
      if (id !== this.requestId) return
      this.resumen = resumen
      this.listaPago = pagos
    } catch (error) {
      console.error('Error al cargar los pagos del mes', error)
    } finally {
      if (id === this.requestId) this.cargando = false
    }
  }

  agregarPago() { this.router.navigate(['/savePago']) }
  editarPago(pagoId: number) { this.router.navigate(['/savePago'], { queryParams: { pagoId } }) }
  volver() { this.location.back() }

  modalParaEliminar(id: number, nombre: string) {
    this.idEliminar = id
    this.tituloModal = "Eliminar Pago"
    this.cuerpoModal = "Quiere eliminar el pago del evento: " + nombre
    this.botonModal = "Eliminar"
    this.setModal(!this.modal)
  }

  setModal(modal: boolean) { this.modal = modal }

  async eliminar() {
    try {
      await this.pagoService.delete(this.idEliminar)
      await this.cargarMes()
    } catch (error) {
      console.error("Error al eliminar el pago", error)
    }
  }

  async descargar(id: number) {
    try {
      const blob = await this.pagoService.descargarPago(id)
      const link = document.createElement('a')
      link.href = window.URL.createObjectURL(blob)
      link.download = 'comprobante_de_pago.pdf'
      link.click()
      link.remove()
    } catch (error: any) {
      console.error('Error al descargar el PDF:', error)
    }
  }
}