import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { lastValueFrom } from 'rxjs'
import { REST_SERVER_URL } from 'src/util/configuration'
import {
  Evento,
  EventoBuscarFecha,
  EventoCatering,
  EventoExtra,
  EventoHora,
  EventoJSON,
  EventoPago,
  EventoVer
} from '../model/Evento'
import { FechaForm } from '../model/FechaForm'
import { GenericItem } from '../model/GenericItem'
import { Cliente, Usuario, UsuarioJSON } from '../model/Usuario'
import { UsuarioService } from './usuario.service'
import { LoginService } from './login.service'
import { Pago } from '../model/Pago'
import { CustomResponse } from 'src/util/customResponse'

@Injectable({
  providedIn: 'root'
})
export class EventoService {

  constructor(
    private httpClient: HttpClient,
    private usuarioService: UsuarioService,
    private loginService: LoginService
  ) { }

  // ==================== BÚSQUEDAS BÁSICAS ====================

  /**
   * Obtiene un evento por su ID con todos sus detalles
   * GET /v1/eventos/{eventoId}
   * 
   * @param eventoId ID del evento a obtener
   * @returns EventoVer con todos los detalles del evento
   */
  async getEventoVer(eventoId: number): Promise<EventoVer> {
    const response = await lastValueFrom(
      this.httpClient.get<CustomResponse<EventoVer>>(
        REST_SERVER_URL + '/v1/eventos/' + eventoId
      )
    )
    return response.data
  }

  /**
   * Obtiene el presupuesto de un evento
   * GET /v1/eventos/{eventoId}/presupuesto
   * 
   * @param eventoId ID del evento
   * @returns Presupuesto total en formato number
   */
  async getPresupuesto(eventoId: number): Promise<number> {
    const response = await lastValueFrom(
      this.httpClient.get<CustomResponse<number>>(
        REST_SERVER_URL + '/v1/eventos/' + eventoId + '/presupuesto'
      )
    )
    return response.data
  }

  /**
   * Obtiene información de extras de un evento
   * GET /v1/eventos/{eventoId}/extra
   * 
   * @param eventoId ID del evento
   * @returns EventoExtra con desglose de extras
   */
  async getEventoExtra(eventoId: number): Promise<EventoExtra> {
    const response = await lastValueFrom(
      this.httpClient.get<CustomResponse<EventoExtra>>(
        REST_SERVER_URL + '/v1/eventos/' + eventoId + '/extra'
      )
    )
    return response.data
  }

  /**
   * Obtiene información de catering de un evento
   * GET /v1/eventos/{eventoId}/catering
   * 
   * @param eventoId ID del evento
   * @returns EventoCatering con desglose de catering
   */
  async getEventoCatering(eventoId: number): Promise<EventoCatering> {
    const response = await lastValueFrom(
      this.httpClient.get<CustomResponse<EventoCatering>>(
        REST_SERVER_URL + '/v1/eventos/' + eventoId + '/catering'
      )
    )
    return response.data
  }

  /**
   * Obtiene información de horarios de un evento
   * GET /v1/eventos/{eventoId}/hora
   * 
   * @param eventoId ID del evento
   * @returns EventoHora con inicio y fin
   */
  async getEventoHora(eventoId: number): Promise<EventoHora> {
    const response = await lastValueFrom(
      this.httpClient.get<CustomResponse<EventoHora>>(
        REST_SERVER_URL + '/v1/eventos/' + eventoId + '/hora'
      )
    )
    return response.data
  }

  /**
   * Obtiene los estados disponibles para eventos
   * GET /v1/eventos/estados
   * 
   * @returns Array de estados disponibles (COTIZADO, CONFIRMADO, etc)
   */
  async getAllEstado(): Promise<string[]> {
    const response = await lastValueFrom(
      this.httpClient.get<CustomResponse<string[]>>(
        REST_SERVER_URL + '/v1/eventos/estados'
      )
    )
    return response.data
  }

  /**
   * Obtiene los estados disponibles para crear nuevos eventos
   * GET /v1/eventos/estados/nuevo
   * 
   * @returns Array de estados para nuevos eventos
   */
  async getAllEstadoForSaveEvento(): Promise<string[]> {
    const response = await lastValueFrom(
      this.httpClient.get<CustomResponse<string[]>>(
        REST_SERVER_URL + '/v1/eventos/estados/nuevo'
      )
    )
    return response.data
  }

  // ==================== EVENTOS POR EMPRESA ====================

  /**
   * Obtiene eventos de una empresa paginados y filtrados
   * GET /v1/eventos/empresa/{empresaId}/eventos?page=0&size=10&search=opcional
   * 
   * Consolidación de getAllEventoByEmpresaId + getAllEventoByFilterName
   * 
   * @param pageNumber Página a obtener (default 0)
   * @param search Término de búsqueda opcional
   * @returns Array de eventos mapeados a clase Evento
   */
  async getAllEventoByEmpresa(
    pageNumber: number = 0,
    search: string = ''
  ): Promise<Evento[]> {
    const empresaId = this.usuarioService.getEmpresaId()
    
    const params: any = {
      page: pageNumber,
      size: 10
    }

    if (search && search.trim()) {
      params.search = search
    }

    const response = await lastValueFrom(
      this.httpClient.get<CustomResponse<{
        content: EventoJSON[],
        totalElements: number,
        totalPages: number,
        currentPage: number,
        pageSize: number
      }>>(
        REST_SERVER_URL + '/v1/eventos/empresa/' + empresaId + '/eventos',
        { params }
      )
    )
    return response.data.content.map((evento: EventoJSON) => Evento.fromJson(evento))
  }

  /**
   * Obtiene eventos de una empresa sin filtro (legacy)
   * Usa internamente getAllEventoByEmpresa sin search
   * 
   * @deprecated Usa getAllEventoByEmpresa(pageNumber) en su lugar
   */
  async getAllEventoByEmpresaId(pageNumber: number): Promise<Evento[]> {
    return this.getAllEventoByEmpresa(pageNumber, '')
  }

  /**
   * Obtiene eventos de una empresa filtrados (legacy)
   * Usa internamente getAllEventoByEmpresa con search
   * 
   * @deprecated Usa getAllEventoByEmpresa(pageNumber, buscar) en su lugar
   */
  async getAllEventoByFilterName(
    pageNumber: number,
    buscar: string
  ): Promise<Evento[]> {
    return this.getAllEventoByEmpresa(pageNumber, buscar)
  }

  /**
   * Obtiene la cantidad total de eventos de una empresa
   * GET /v1/eventos/empresa/{empresaId}/cantidad
   * 
   * @returns Cantidad de eventos activos
   */
  async cantEventos(): Promise<number> {
    const empresaId = this.usuarioService.getEmpresaId()
    const response = await lastValueFrom(
      this.httpClient.get<CustomResponse<number>>(
        REST_SERVER_URL + '/v1/eventos/empresa/' + empresaId + '/cantidad'
      )
    )
    return response.data
  }

  /**
   * Obtiene la cantidad de eventos filtrados por búsqueda
   * GET /v1/eventos/empresa/{empresaId}/cantidad-filtrada?search=X
   * 
   * @param buscar Término de búsqueda
   * @returns Cantidad de eventos que coinciden con la búsqueda
   */
  async cantEventosFiltrados(buscar: string): Promise<number> {
    const empresaId = this.usuarioService.getEmpresaId()
    const response = await lastValueFrom(
      this.httpClient.get<CustomResponse<number>>(
        REST_SERVER_URL + '/v1/eventos/empresa/' + empresaId + '/cantidad-filtrada',
        { params: { search: buscar } }
      )
    )
    return response.data
  }

  /**
   * Obtiene eventos de una empresa en una fecha específica
   * GET /v1/eventos/empresa/{empresaId}/por-fecha?fecha=YYYY-MM-DD
   * 
   * @param fecha Fecha en formato YYYY-MM-DD o string de fecha
   * @returns Array de eventos en esa fecha
   */
  async getAllEventosByFecha(fecha: string): Promise<Evento[]> {
    const empresaId = this.usuarioService.getEmpresaId()
    
    // Convertir fecha si es necesario
    let fechaFormato = fecha
    if (fecha.includes('/')) {
      const partes = fecha.split('/')
      fechaFormato = `${partes[2]}-${partes[1]}-${partes[0]}`
    }

    const response = await lastValueFrom(
      this.httpClient.get<CustomResponse<EventoJSON[]>>(
        REST_SERVER_URL + '/v1/eventos/empresa/' + empresaId + '/por-fecha',
        { params: { fecha: fechaFormato } }
      )
    )
    return response.data.map((evento: EventoJSON) => Evento.fromJson(evento))
  }

  /**
   * Obtiene eventos para la agenda/calendario de una empresa
   * GET /v1/eventos/empresa/{empresaId}/agenda
   * 
   * @returns Array de eventos formateados para agenda
   */
  async getAllEventosForAgendaByEmpresaId(): Promise<any[]> {
    const empresaId = this.usuarioService.getEmpresaId()
    const response = await lastValueFrom(
      this.httpClient.get<CustomResponse<any[]>>(
        REST_SERVER_URL + '/v1/eventos/empresa/' + empresaId + '/agenda'
      )
    )
    return response.data
  }

  // ==================== EVENTOS POR USUARIO ====================

  /**
   * Obtiene eventos contratados por un usuario/cliente en una empresa
   * GET /v1/eventos/usuario/{usuarioId}/empresa/{empresaId}
   * 
   * ✅ NUEVO - Endpoint que faltaba
   * 
   * @param usuarioId ID del usuario
   * @param empresaId ID de la empresa
   * @returns Map con eventos y cantidad
   */
  async getEventosByUsuario(
    usuarioId: number,
    empresaId: number
  ): Promise<{ eventos: any[], cantidad: number }> {
    const response = await lastValueFrom(
      this.httpClient.get<CustomResponse<{
        eventos: any[],
        cantidad: number
      }>>(
        REST_SERVER_URL + '/v1/eventos/usuario/' + usuarioId + '/empresa/' + empresaId
      )
    )
    return response.data
  }

  // ==================== VALIDACIONES ====================

  /**
   * Obtiene horarios disponibles para una fecha específica
   * POST /v1/eventos/disponibilidad/horarios
   * 
   * @param fecha FechaForm con año, mes, día
   * @returns Array de horarios disponibles
   */
  async getListaEventoByDiaAndEmpresaId(fecha: FechaForm): Promise<string[]> {
    const empresaId = this.usuarioService.getEmpresaId()
    const eventoBuscarFecha = new EventoBuscarFecha(
      empresaId,
      new Date(fecha.year, fecha.mes, fecha.dia, 0, 0, 0),
      new Date(fecha.year, fecha.mes, fecha.dia, 23, 59, 59)
    )

    const response = await lastValueFrom(
      this.httpClient.post<CustomResponse<string[]>>(
        REST_SERVER_URL + '/v1/eventos/disponibilidad/horarios',
        eventoBuscarFecha
      )
    )
    return response.data
  }

  /**
   * Valida si un horario específico está disponible
   * POST /v1/eventos/disponibilidad/validar
   * 
   * @param evento Evento con inicio y fin para validar
   * @returns true si está disponible, false si hay conflicto
   */
  async getHorarioDisponible(evento: Evento): Promise<boolean> {
    const empresaId = this.usuarioService.getEmpresaId()
    const eventoBuscarFecha = new EventoBuscarFecha(
      empresaId,
      new Date(evento.inicio),
      new Date(evento.fin)
    )

    const response = await lastValueFrom(
      this.httpClient.post<CustomResponse<boolean>>(
        REST_SERVER_URL + '/v1/eventos/disponibilidad/validar',
        eventoBuscarFecha
      )
    )
    return response.data
  }

  // ==================== CRUD ====================

  /**
   * Crea un nuevo evento
   * POST /v1/eventos
   * 
   * @param evento Evento a crear (sin empresaId ni encargadoId, se agregan aquí)
   * @returns ID del evento creado
   */
  async save(evento: Evento): Promise<number> {
    evento.empresaId = this.usuarioService.getEmpresaId()
    evento.encargadoId = await this.loginService.getUsuarioId()

    const response = await lastValueFrom(
      this.httpClient.post<CustomResponse<number>>(
        REST_SERVER_URL + '/v1/eventos',
        evento
      )
    )
    return response.data
  }

  /**
   * Elimina un evento (soft delete)
   * DELETE /v1/eventos/{eventoId}
   * 
   * @param id ID del evento a eliminar
   */
  async delete(id: number): Promise<GenericItem> {
    return lastValueFrom(
      this.httpClient.delete<GenericItem>(
        REST_SERVER_URL + '/v1/eventos/' + id
      )
    )
  }

  // ==================== ACTUALIZAR INFORMACIÓN ====================

  /**
   * Actualiza los horarios de un evento
   * PUT /v1/eventos/{eventoId}/hora
   * 
   * @param evento EventoHora con id, inicio, fin
   * @returns EventoHora actualizado
   */
  async editEventoHora(evento: EventoHora): Promise<EventoHora> {
    const response = await lastValueFrom(
      this.httpClient.put<CustomResponse<EventoHora>>(
        REST_SERVER_URL + '/v1/eventos/' + evento.id + '/hora',
        evento
      )
    )
    return response.data
  }

  /**
   * Actualiza los extras de un evento
   * PUT /v1/eventos/{eventoId}/extra
   * 
   * @param evento EventoExtra con id y detalles
   * @returns ID del evento actualizado
   */
  async editEventoExtra(evento: EventoExtra): Promise<number> {
    const response = await lastValueFrom(
      this.httpClient.put<CustomResponse<number>>(
        REST_SERVER_URL + '/v1/eventos/extra',
        evento
      )
    )
    return response.data
  }

  /**
   * Actualiza la información de catering de un evento
   * PUT /v1/eventos/{eventoId}/catering
   * 
   * @param evento EventoCatering con id y detalles
   * @returns ID del evento actualizado
   */
  async editEventoCatering(evento: EventoCatering): Promise<number> {
    const response = await lastValueFrom(
      this.httpClient.put<CustomResponse<number>>(
        REST_SERVER_URL + '/v1/eventos/' + evento.id + '/catering',
        evento
      )
    )
    return response.data
  }

  /**
   * Actualiza las anotaciones de un evento
   * PATCH /v1/eventos/{eventoId}/anotaciones
   * 
   * @param anotacion Texto de la anotación
   * @param id ID del evento
   * @returns Anotación actualizada
   */
  async editEventoAnotaciones(anotacion: string, id: number): Promise<string> {
    const response = await lastValueFrom(
      this.httpClient.patch<CustomResponse<string>>(
        REST_SERVER_URL + '/v1/eventos/' + id + '/anotaciones',
        anotacion
      )
    )
    return response.data
  }

  /**
   * Actualiza la capacidad de un evento (adultos y niños)
   * PATCH /v1/eventos/{eventoId}/capacidad
   * 
   * ✅ NUEVO - Consolidación de editEventoCantNinos + editEventoCantAdultos
   * 
   * @param eventoId ID del evento
   * @param capacidadAdultos Número de adultos
   * @param capacidadNinos Número de niños
   * @returns Capacidad actualizada
   */
  async editEventoCapacidad(
    eventoId: number,
    capacidadAdultos: number,
    capacidadNinos: number
  ): Promise<{ capacidadAdultos: number, capacidadNinos: number }> {
    const response = await lastValueFrom(
      this.httpClient.patch<CustomResponse<{
        capacidadAdultos: number,
        capacidadNinos: number
      }>>(
        REST_SERVER_URL + '/v1/eventos/' + eventoId + '/capacidad',
        { capacidadAdultos, capacidadNinos }
      )
    )
    return response.data
  }

  /**
   * Actualiza solo la cantidad de niños (legacy)
   * Usa internamente editEventoCapacidad
   * 
   * @deprecated Usa editEventoCapacidad() en su lugar
   */
  async editEventoCantNinos(eventoVer: EventoVer): Promise<number> {
    const result = await this.editEventoCapacidad(
      eventoVer.id,
      eventoVer.capacidad.capacidadAdultos,
      eventoVer.capacidad.capacidadNinos
    )
    return result.capacidadNinos
  }

  /**
   * Actualiza solo la cantidad de adultos (legacy)
   * Usa internamente editEventoCapacidad
   * 
   * @deprecated Usa editEventoCapacidad() en su lugar
   */
  async editEventoCantAdultos(eventoVer: EventoVer): Promise<number> {
    const result = await this.editEventoCapacidad(
      eventoVer.id,
      eventoVer.capacidad.capacidadAdultos,
      eventoVer.capacidad.capacidadNinos
    )
    return result.capacidadAdultos
  }

  /**
   * Actualiza el nombre de un evento
   * PATCH /v1/eventos/{eventoId}/nombre
   * 
   * @param nombre Nuevo nombre del evento
   * @param id ID del evento
   * @returns Nombre actualizado
   */
  async editEventoNombre(nombre: string, id: number): Promise<string> {
    const response = await lastValueFrom(
      this.httpClient.patch<CustomResponse<string>>(
        REST_SERVER_URL + '/v1/eventos/' + id + '/nombre',
        nombre
      )
    )
    return response.data
  }

  /**
   * Procesa y retorna especificaciones calculadas de un evento
   * POST /v1/eventos/empresa/{empresaId}/especificaciones
   * 
   * @param evento Evento con datos a procesar
   * @returns Evento con especificaciones procesadas
   */
  async recorrerEspecificaciones(evento: Evento): Promise<any> {
    const empresaId = this.usuarioService.getEmpresaId()
    const response = await lastValueFrom(
      this.httpClient.post<CustomResponse<any>>(
        REST_SERVER_URL + '/v1/eventos/empresa/' + empresaId + '/especificaciones',
        evento
      )
    )
    return response.data
  }

  // ==================== COMUNICACIÓN ====================

  /**
   * Reenvia el email confirmatorio de un evento al cliente
   * POST /v1/eventos/{eventoId}/reenviar-mail?empresaId={empresaId}
   * 
   * @param eventoId ID del evento
   * @returns true si se envió correctamente
   */
  async reenviarMail(eventoId: number): Promise<boolean> {
    const empresaId = this.usuarioService.getEmpresaId()
    const response = await lastValueFrom(
      this.httpClient.post<CustomResponse<string>>(
        REST_SERVER_URL + '/v1/eventos/' + eventoId + '/reenviar-mail',
        {},
        { params: { empresaId: empresaId.toString() } }
      )
    )
    return response.data === 'OK'
  }

  // ==================== DESCARGAS ====================

  /**
   * Descarga el comprobante/presupuesto de un evento en PDF
   * GET /v1/eventos/{eventoId}/comprobante/pdf
   * 
   * @param eventoId ID del evento
   * @returns Blob con el contenido del PDF
   */
  async descargarEvento(eventoId: number): Promise<Blob> {
    return lastValueFrom(
      this.httpClient.get(
        REST_SERVER_URL + '/v1/eventos/' + eventoId + '/comprobante/pdf',
        { responseType: 'blob' }
      )
    )
  }

  /**
   * Descarga el estado de cuenta de un evento en PDF
   * GET /v1/eventos/{eventoId}/estado-cuenta/pdf
   * 
   * @param eventoId ID del evento
   * @returns Blob con el contenido del PDF
   */
  async generarEstadoDeCuentaPDF(eventoId: number): Promise<Blob> {
    return lastValueFrom(
      this.httpClient.get(
        REST_SERVER_URL + '/v1/eventos/' + eventoId + '/estado-cuenta/pdf',
        { responseType: 'blob' }
      )
    )
  }
}