import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { Pago, ResumenPagosMes } from 'src/app/model/Pago';
import { PagoService } from 'src/app/services/pago.service';
import { GastoService } from 'src/app/services/gasto.service';
import { Gasto, Movimiento } from 'src/app/model/Gasto';
import { ToastService } from 'src/app/services/toast.service';

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

  listaMovimiento: Array<Movimiento> = []
  resumen: ResumenPagosMes = { ingresos: 0, egresos: 0, balance: 0, cantidadIngresos: 0, cantidadEgresos: 0 }
  cargando = false
  private requestId = 0   // evita que una respuesta vieja pise a una nueva si se clickea rápido

  modal = false
  movimientoEliminar: Movimiento | null = null
  cuerpoModal = ""
  tituloModal = ""
  botonModal = ""
  descargasEnCurso = new Set<number>()
  descargandoBalance = false

  mostrarRangoBalance = false
  balanceDesde = ''   // 'YYYY-MM'
  balanceHasta = ''
  mesActualISO = this.aISO(new Date())


  constructor(
    private pagoService: PagoService,
    private gastoService: GastoService,
    private router: Router,
    private location: Location,
    private toastService: ToastService
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
      const [resumen, pagos, gastos] = await Promise.all([
        this.pagoService.getResumenPagosMes(this.mes, this.anio),
        this.pagoService.getAllPagoByMes(this.mes, this.anio),
        this.gastoService.getAllGastoByMes(this.mes, this.anio)
      ])
      if (id !== this.requestId) return
      this.resumen = resumen
      this.listaMovimiento = this.unir(pagos, gastos)
    } catch (error) {
      console.error('Error al cargar los movimientos del mes', error)
    } finally {
      if (id === this.requestId) this.cargando = false
    }
  }

  private unir(pagos: Pago[], gastos: Gasto[]): Movimiento[] {
    const ingresos: Movimiento[] = pagos.map(p => ({
      tipo: 'INGRESO', id: p.id, fecha: p.fecha, titulo: p.nombreEvento,
      etiqueta: p.medioDePago, monto: p.monto
    }))
    const egresos: Movimiento[] = gastos.map(g => ({
      tipo: 'EGRESO', id: g.id, fecha: g.fecha, titulo: g.descripcion,
      etiqueta: g.tipoGasto, monto: g.monto
    }))
    return [...ingresos, ...egresos]
      .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
  }

  agregarPago() { this.router.navigate(['/savePago']) }
  agregarGasto() { this.router.navigate(['/saveGasto']) }

  editar(m: Movimiento) {
    if (m.tipo === 'INGRESO') this.router.navigate(['/savePago'], { queryParams: { pagoId: m.id } })
    else this.router.navigate(['/saveGasto'], { queryParams: { gastoId: m.id } })
  }

  volver() { this.location.back() }

  modalParaEliminar(m: Movimiento) {
    this.movimientoEliminar = m
    const esIngreso = m.tipo === 'INGRESO'
    this.tituloModal = esIngreso ? "Eliminar Pago" : "Eliminar Gasto"
    this.cuerpoModal = esIngreso
      ? "Quiere eliminar el pago del evento: " + m.titulo
      : "Quiere eliminar el gasto: " + m.titulo
    this.botonModal = "Eliminar"
    this.setModal(!this.modal)
  }

  setModal(modal: boolean) { this.modal = modal }

  async eliminar() {
    const m = this.movimientoEliminar
    if (!m) return
    try {
      if (m.tipo === 'INGRESO') await this.pagoService.delete(m.id)
      else await this.gastoService.delete(m.id)
      await this.cargarMes()
    } catch (error) {
      console.error("Error al eliminar el movimiento", error)
    }
  }

  async descargar(id: number) {
    if (this.descargasEnCurso.has(id)) return;
    this.descargasEnCurso.add(id);
    try {
      const blob = await this.pagoService.descargarPago(id)
      const link = document.createElement('a')
      link.href = window.URL.createObjectURL(blob)
      link.download = 'comprobante_de_pago.pdf'
      link.click()
      link.remove()
    } catch (error: any) {
      console.error('Error al descargar el PDF:', error)
    } finally {
      this.descargasEnCurso.delete(id)
    }
  }

  // El botón del header solo abre/cierra el selector de período
  descargarBalance() {
    this.mostrarRangoBalance = !this.mostrarRangoBalance
    if (this.mostrarRangoBalance && !this.balanceHasta) {
      this.balanceHasta = this.mesActualISO
      this.balanceDesde = this.aISO(new Date(this.hoy.getFullYear(), this.hoy.getMonth() - 11, 1))
    }
  }

  private aISO(d: Date): string {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
  }



  async confirmarDescargaBalance(rango: { desde: string; hasta: string }) {
    if (this.descargandoBalance) return
    this.balanceDesde = rango.desde
    this.balanceHasta = rango.hasta
    const [dA, dM] = this.balanceDesde.split('-').map(Number)
    const [hA, hM] = this.balanceHasta.split('-').map(Number)
    this.descargandoBalance = true
    try {
      const blob = await this.pagoService.descargarBalance(dM, dA, hM, hA)
      const link = document.createElement('a')
      link.href = window.URL.createObjectURL(blob)
      link.download = `balance_${this.balanceDesde}_a_${this.balanceHasta}.pdf`
      link.click()
      link.remove()
      this.mostrarRangoBalance = false
    } catch (error) {
      this.toastService.showInfo('No se pudo generar el balance')
    } finally {
      this.descargandoBalance = false
    }
  }
}