import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { Pago, ResumenPagosMes } from 'src/app/model/Pago';
import { PagoService } from 'src/app/services/pago.service';
import { GastoService } from 'src/app/services/gasto.service';
import { Gasto, Movimiento } from 'src/app/model/Gasto';
import { ToastService } from 'src/app/services/toast.service';

export type FiltroMovimiento = 'TODO' | 'INGRESO' | 'EGRESO'

/**
 * Item de la lista: un movimiento normal o un grupo de gastos de un mismo evento.
 * Requiere que Gasto (TS) exponga `eventoId?: number | null` y `nombreEvento?: string | null`.
 */
export interface MovimientoLista extends Movimiento {
  eventoId?: number | null
  nombreEvento?: string | null
  esGrupo?: boolean
  items?: MovimientoLista[]   // desglose cuando es grupo
}

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

  listaMovimiento: Array<MovimientoLista> = []
  filtroActual: FiltroMovimiento = 'TODO'
  gruposExpandidos = new Set<number>()   // eventoId de los grupos abiertos

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
  descargandoPlanilla = false

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

  // ── Filtro de vista ──────────────────────────────────────────────────────

  get movimientosFiltrados(): MovimientoLista[] {
    if (this.filtroActual === 'TODO') return this.listaMovimiento
    return this.listaMovimiento.filter(m => m.tipo === this.filtroActual)
  }

  setFiltro(filtro: FiltroMovimiento) {
    this.filtroActual = filtro
  }

  // ── Grupos de gastos por evento ──────────────────────────────────────────

  toggleGrupo(m: MovimientoLista) {
    if (m.eventoId == null) return
    if (this.gruposExpandidos.has(m.eventoId)) this.gruposExpandidos.delete(m.eventoId)
    else this.gruposExpandidos.add(m.eventoId)
  }

  estaExpandido(m: MovimientoLista): boolean {
    return m.eventoId != null && this.gruposExpandidos.has(m.eventoId)
  }

  trackMovimiento(_: number, m: MovimientoLista): string {
    return m.esGrupo ? `g-${m.eventoId}` : `${m.tipo}-${m.id}`
  }

  // ── Navegación de mes ────────────────────────────────────────────────────

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
      this.gruposExpandidos.clear()
      this.listaMovimiento = this.unir(pagos, gastos)
    } catch (error) {
      console.error('Error al cargar los movimientos del mes', error)
    } finally {
      if (id === this.requestId) this.cargando = false
    }
  }

  private unir(pagos: Pago[], gastos: Gasto[]): MovimientoLista[] {
    const ingresos: MovimientoLista[] = pagos.map(p => ({
      tipo: 'INGRESO', id: p.id, fecha: p.fecha, titulo: p.nombreEvento,
      etiqueta: p.medioDePago, monto: p.monto
    }))
    const egresos: MovimientoLista[] = gastos.map(g => ({
      tipo: 'EGRESO', id: g.id, fecha: g.fecha, titulo: g.descripcion,
      etiqueta: g.tipoGasto, monto: g.monto,
      eventoId: g.eventoId ?? null, nombreEvento: g.nombreEvento ?? null
    }))
    return [...ingresos, ...this.agruparPorEvento(egresos)]
      .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
  }

  /** Egresos del mismo evento (2 o más) -> un único ítem con el total y el desglose en `items`. */
  private agruparPorEvento(egresos: MovimientoLista[]): MovimientoLista[] {
    const sueltos: MovimientoLista[] = []
    const porEvento = new Map<number, MovimientoLista[]>()

    for (const e of egresos) {
      if (e.eventoId == null) { sueltos.push(e); continue }
      const lista = porEvento.get(e.eventoId) ?? []
      lista.push(e)
      porEvento.set(e.eventoId, lista)
    }

    porEvento.forEach((items, eventoId) => {
      if (items.length === 1) { sueltos.push(items[0]); return }
      const ordenados = [...items].sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
      sueltos.push({
        tipo: 'EGRESO',
        id: eventoId,
        fecha: ordenados[0].fecha,
        titulo: `Gasto Evento: ${ordenados[0].nombreEvento ?? ''}`,
        etiqueta: 'EVENTO',
        monto: ordenados.reduce((acc, i) => acc + i.monto, 0),
        eventoId,
        nombreEvento: ordenados[0].nombreEvento,
        esGrupo: true,
        items: ordenados
      })
    })
    return sueltos
  }

  // ── Acciones ─────────────────────────────────────────────────────────────

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
      this.guardarArchivo(blob, 'comprobante_de_pago.pdf')
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

  private guardarArchivo(blob: Blob, nombre: string) {
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = nombre
    link.click()
    link.remove()
    window.URL.revokeObjectURL(url)
  }

  private get hayDescargaEnCurso(): boolean {
    return this.descargandoBalance || this.descargandoPlanilla
  }

  async confirmarDescargaBalance(rango: { desde: string; hasta: string }) {
    if (this.hayDescargaEnCurso) return
    this.balanceDesde = rango.desde
    this.balanceHasta = rango.hasta
    const [dA, dM] = this.balanceDesde.split('-').map(Number)
    const [hA, hM] = this.balanceHasta.split('-').map(Number)
    this.descargandoBalance = true
    try {
      const blob = await this.pagoService.descargarBalance(dM, dA, hM, hA)
      this.guardarArchivo(blob, `balance_${this.balanceDesde}_a_${this.balanceHasta}.pdf`)
      this.mostrarRangoBalance = false
    } catch (error) {
      this.toastService.showInfo('No se pudo generar el balance')
    } finally {
      this.descargandoBalance = false
    }
  }

  async confirmarDescargaPlanilla(rango: { desde: string; hasta: string }) {
    if (this.hayDescargaEnCurso) return
    this.balanceDesde = rango.desde
    this.balanceHasta = rango.hasta
    const [dA, dM] = this.balanceDesde.split('-').map(Number)
    const [hA, hM] = this.balanceHasta.split('-').map(Number)
    this.descargandoPlanilla = true
    try {
      const blob = await this.pagoService.descargarPlanillaMovimientos(dM, dA, hM, hA)
      this.guardarArchivo(blob, `planilla_${this.balanceDesde}_a_${this.balanceHasta}.xlsx`)
      this.mostrarRangoBalance = false
    } catch (error) {
      this.toastService.showInfo('No se pudo generar la planilla')
    } finally {
      this.descargandoPlanilla = false
    }
  }
}