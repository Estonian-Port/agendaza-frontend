import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { map } from 'rxjs'
import { API_URL } from 'src/util/configuration'
import { CustomResponse } from 'src/util/customResponse'

export interface TerminosDTO {
  version: string
  texto: string
  hash: string
}

@Injectable({
  providedIn: 'root'
})
export class TerminosService {
  constructor(private httpClient: HttpClient) {}

  getVigentes() {
    return this.httpClient.get<CustomResponse<TerminosDTO> | TerminosDTO>(`${API_URL}/v1/terminos/vigente`).pipe(
      map((response) => 'data' in response ? response.data : response)
    )
  }
}