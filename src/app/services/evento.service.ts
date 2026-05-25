import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { REST_SERVER_URL } from 'src/util/configuration';
import { Evento, EventoBuscarFecha, EventoCatering, EventoExtra, EventoHora, EventoJSON, EventoPago, EventoVer } from '../model/Evento';
import { FechaForm } from '../model/FechaForm';
import { GenericItem } from '../model/GenericItem';
import { Cliente, Usuario, UsuarioJSON } from '../model/Usuario';
import { UsuarioService } from './usuario.service';
import { LoginService } from './login.service';
import { Pago } from '../model/Pago';
import { CustomResponse } from 'src/util/customResponse';

@Injectable({
  providedIn: 'root'
})
export class EventoService {
  eventoId : number = 0
  eventoCodigo : string = ""
  fechaFiltroForAbmEvento : string = ""
  cantidadEventos : number = 0
  paginaActual: number = 0

  constructor(private httpClient : HttpClient, private usuarioService : UsuarioService, private loginService : LoginService) { }

  async getAllEventoByEmpresaId(pageNumber : number){
    // Nota: Si mantuviste la paginación tradicional en la URL o mutó a params la adaptás acá, 
    // pero respetando la base nueva /v1/eventos/empresa/...
    const listaItem$ = this.httpClient.get<CustomResponse<EventoJSON[]>>(REST_SERVER_URL + '/v1/eventos/empresa/' + this.usuarioService.getEmpresaId() + '/' + pageNumber)
    const response = await lastValueFrom(listaItem$)
    return response.data.map((evento: EventoJSON) => Evento.fromJson(evento))
  }
  
  async getAllEventosByFecha() {
    const listaItem$ = this.httpClient.get<CustomResponse<any[]>>(REST_SERVER_URL + `/v1/eventos/empresa/${this.usuarioService.getEmpresaId()}/fecha/${this.fechaFiltroForAbmEvento}`)
    const response = await lastValueFrom(listaItem$)
    this.fechaFiltroForAbmEvento = ""
    return response.data.map((evento: EventoJSON) => Evento.fromJson(evento))
  }

  async getAllEventoByFilterName(pageNumber : number, buscar : string){
    const listaItem$ = this.httpClient.get<CustomResponse<EventoJSON[]>>(REST_SERVER_URL + '/v1/eventos/empresa/' + this.usuarioService.getEmpresaId() + '/' + pageNumber + '/' + buscar)
    const response = await lastValueFrom(listaItem$)
    return response.data.map((evento: EventoJSON) => Evento.fromJson(evento))
  }
  
  async cantEventos(){
    const cant$ = this.httpClient.get<CustomResponse<number>>(REST_SERVER_URL + '/v1/eventos/empresa/' + this.usuarioService.getEmpresaId() + '/cantidad')
    const response = await lastValueFrom(cant$)
    this.cantidadEventos = response.data
    return this.cantidadEventos
  }

  async cantEventosFiltrados(buscar : string){
    const cant$ = this.httpClient.get<CustomResponse<number>>(REST_SERVER_URL + '/v1/eventos/empresa/' + this.usuarioService.getEmpresaId() + '/buscar/' + buscar + '/cantidad')
    const response = await lastValueFrom(cant$)
    this.cantidadEventos = response.data
    return this.cantidadEventos
  }

  async save(evento: Evento) {
    evento.empresaId = this.usuarioService.getEmpresaId()
    evento.encargadoId = await this.loginService.getUsuarioId()
    const item$ = this.httpClient.post<CustomResponse<any>>(REST_SERVER_URL + '/v1/eventos', evento)
    const response = await lastValueFrom(item$)
    return response.data
  }

  delete(id: number) {
    return this.httpClient.delete<GenericItem>(REST_SERVER_URL + '/v1/eventos/' + id)
  }

  async getAllEstado() {
    const listaItem$ = this.httpClient.get<CustomResponse<string[]>>(REST_SERVER_URL + '/v1/eventos/estados')
    const response = await lastValueFrom(listaItem$)
    return response.data
  }
  
  async getAllEstadoForSaveEvento() {
    const listaItem$ = this.httpClient.get<CustomResponse<string[]>>(REST_SERVER_URL + '/v1/eventos/estados/nuevo')
    const response = await lastValueFrom(listaItem$)
    return response.data
  }

  async getEventoExtra() {
    const evento$ = this.httpClient.get<CustomResponse<EventoExtra>>(REST_SERVER_URL + '/v1/eventos/' + this.eventoId + '/extra')
    const response = await lastValueFrom(evento$)
    return response.data
  }

  async getEventoCatering() {
    const evento$ = this.httpClient.get<CustomResponse<EventoCatering>>(REST_SERVER_URL + '/v1/eventos/' + this.eventoId + '/catering')
    const response = await lastValueFrom(evento$)
    return response.data
  }

  async getEventoHora() {
    const evento$ = this.httpClient.get<CustomResponse<EventoHora>>(REST_SERVER_URL + '/v1/eventos/' + this.eventoId + '/hora')
    const response = await lastValueFrom(evento$)
    return response.data
  }

  async getEventoVer() {
    const evento$ = this.httpClient.get<CustomResponse<EventoVer>>(REST_SERVER_URL + '/v1/eventos/' + this.eventoId)
    const response = await lastValueFrom(evento$)
    return response.data
  }

  async getPresupuesto(evento: EventoVer) {
    const presupuesto$ = this.httpClient.get<CustomResponse<number>>(REST_SERVER_URL + '/v1/eventos/' + this.eventoId + '/presupuesto')
    const response = await lastValueFrom(presupuesto$)
    return response.data
  }

  async editEventoHora(evento : EventoHora) {
    const item$ = this.httpClient.put<CustomResponse<EventoHora>>(REST_SERVER_URL + '/v1/eventos/' + evento.id + '/hora', evento)
    const response = await lastValueFrom(item$)
    return response.data
  }

  async editEventoExtra(evento : EventoExtra) {
    const item$ = this.httpClient.put<CustomResponse<any>>(REST_SERVER_URL + '/v1/eventos/' + evento.id + '/extra', evento)
    const response = await lastValueFrom(item$)
    return response.data
  }

  async editEventoCatering(evento : EventoCatering) {
    const item$ = this.httpClient.put<CustomResponse<EventoHora>>(REST_SERVER_URL + '/v1/eventos/' + evento.id + '/catering', evento)
    const response = await lastValueFrom(item$)
    return response.data
  }

  async editEventoAnotaciones(anotacion : string, id : number) {
    const item$ = this.httpClient.put<CustomResponse<string>>(REST_SERVER_URL + '/v1/eventos/' + id + '/anotaciones', anotacion)
    const response = await lastValueFrom(item$)
    return response.data
  }

  async editEventoCantNinos(eventoVer : EventoVer) {
    const item$ = this.httpClient.put<CustomResponse<number>>(REST_SERVER_URL + '/v1/eventos/' + eventoVer.id + '/capacidad/ninos', eventoVer.capacidad.capacidadNinos)
    const response = await lastValueFrom(item$)
    return response.data
  }

  async editEventoCantAdultos(eventoVer : EventoVer) {
    const item$ = this.httpClient.put<CustomResponse<number>>(REST_SERVER_URL + '/v1/eventos/' + eventoVer.id + '/capacidad/adultos', eventoVer.capacidad.capacidadAdultos)
    const response = await lastValueFrom(item$)
    return response.data
  }

  async editEventoNombre(nombre: string, id: number) {
    const item$ = this.httpClient.put<CustomResponse<string>>(REST_SERVER_URL + '/v1/eventos/' + id + '/nombre', nombre)
    const response = await lastValueFrom(item$)
    return response.data
  }

  async getListaEventoByDiaAndEmpresaId(fecha : FechaForm) {
    const eventoBuscarFecha = new EventoBuscarFecha(this.usuarioService.getEmpresaId(), new Date(fecha.year, fecha.mes, fecha.dia), new Date())
    const item$ = this.httpClient.put<CustomResponse<Array<string>>>(REST_SERVER_URL + '/v1/eventos/disponibilidad/horarios', eventoBuscarFecha)
    const response = await lastValueFrom(item$)
    return response.data
  }

  async getHorarioDisponible(evento : Evento){
    const eventoBuscarFecha = new EventoBuscarFecha(this.usuarioService.getEmpresaId(), new Date(evento.inicio), new Date(evento.fin))
    const item$ = this.httpClient.put<CustomResponse<boolean>>(REST_SERVER_URL + '/v1/eventos/disponibilidad/validar', eventoBuscarFecha)
    const response = await lastValueFrom(item$)
    return response.data
  }

  async reenviarMail(eventoId: number) {
    // Se envía como QueryParam '?empresaId=...' respetando el @RequestParam del controlador de Kotlin
    const item$ = this.httpClient.post<CustomResponse<string>>(REST_SERVER_URL + '/v1/eventos/' + eventoId + '/reenviar-mail', {}, {
      params: { empresaId: this.usuarioService.getEmpresaId().toString() }
    })
    const response = await lastValueFrom(item$)
    return response.data === "OK"
  }

  async recorrerEspecificaciones(evento: Evento) {
    const item$ = this.httpClient.put<CustomResponse<any>>(REST_SERVER_URL + '/v1/eventos/empresa/' + this.usuarioService.getEmpresaId() + '/especificaciones', evento)
    const response = await lastValueFrom(item$)
    return response.data
  }

  async descargarEvento() {
    const item$ = this.httpClient.get(REST_SERVER_URL + '/v1/eventos/' + this.eventoId + '/comprobante/pdf', { responseType: 'blob' })
    return lastValueFrom(item$);
  }

  // Agregamos este método que estaba en el controlador para bajar el estado de cuenta y que no te quede colgado en el front
  async generarEstadoDeCuentaPDF() {
    const item$ = this.httpClient.get(REST_SERVER_URL + '/v1/eventos/' + this.eventoId + '/estado-cuenta/pdf', { responseType: 'blob' })
    return lastValueFrom(item$);
  }

  async getAllEventosForAgendaByEmpresaId() {
    const empresaId = this.usuarioService.getEmpresaId()
    const listaItem$ = this.httpClient.get<CustomResponse<any[]>>(
      REST_SERVER_URL + '/v1/eventos/empresa/' + empresaId + '/agenda'
    )
    const response = await lastValueFrom(listaItem$)
    return response.data
  }
}