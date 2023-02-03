import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { REST_SERVER_URL } from 'src/util/configuration';
import { Pago, PagoJSON } from '../model/Pago';
import { AgendaService } from './agenda.service';

@Injectable({
  providedIn: 'root'
})
export class PagoService {

  constructor(private httpClient: HttpClient, private agendaService : AgendaService) {}

  async getAllPagoByEmpresaId() {
    const listaItem$ = this.httpClient.get<PagoJSON[]>(REST_SERVER_URL + '/getAllPagoByEmpresaId/' + this.agendaService.getEmpresaId())
    const listaItem = await lastValueFrom(listaItem$)
    return listaItem.map((pago) => Pago.fromJson(pago))
  }
}
