import { Component, OnInit } from '@angular/core';
import { ConfiguracionService } from 'src/app/services/configuracion.service';

@Component({
  selector: 'app-abm-evento',
  templateUrl: './abm-evento.component.html',
  styleUrls: ['./abm-evento.component.css']
})
export class AbmEventoComponent implements OnInit {

  listaItems : Array<any> = []
  listaHeader : Array<any> =[]
  currentRegistro : number = 0
  buscar = ""

  constructor(private configuracionService : ConfiguracionService) { }

  async ngOnInit(): Promise<void> {
    this.listaItems = await this.configuracionService.getAllEmpleadosByEmpresaId()

    this.listaHeader.push("id")
    this.listaHeader.push("Nombre")
    this.listaHeader.push("Apellido")
    this.listaHeader.push("Usuario")
  }

}
