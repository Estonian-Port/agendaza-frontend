import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { REST_SERVER_URL } from 'src/util/configuration';
import { Extra, ExtraJSON } from '../model/Extra';
import { AgendaService } from './agenda.service';

@Injectable({
  providedIn: 'root'
})
export class ExtraService {

  constructor(private httpClient: HttpClient, private agendaService : AgendaService) { }

  async getAllExtraByEmpresaId() {
    const listaItem$ = this.httpClient.get<ExtraJSON[]>(REST_SERVER_URL + '/getAllExtrasByEmpresaId/' + this.agendaService.getEmpresaId())
    const listaItem = await lastValueFrom(listaItem$)
    return listaItem.map((extra) => Extra.fromJson(extra))
  }

  
}
