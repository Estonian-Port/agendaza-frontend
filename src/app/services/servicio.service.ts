import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { REST_SERVER_URL } from 'src/util/configuration';
import { Servicio, ServicioJSON } from '../model/Servicio';
import { AgendaService } from './agenda.service';

@Injectable({
  providedIn: 'root'
})
export class ServicioService {

  constructor(private httpClient: HttpClient, private agendaService : AgendaService) {}

  async getAllServicioByEmpresaId() {
    const listaItem$ = this.httpClient.get<ServicioJSON[]>(REST_SERVER_URL + '/getAllServicioByEmpresaId/' + this.agendaService.getEmpresaId())
    const listaItem = await lastValueFrom(listaItem$)
    return listaItem.map((servicio) => Servicio.fromJson(servicio))
  }

}
