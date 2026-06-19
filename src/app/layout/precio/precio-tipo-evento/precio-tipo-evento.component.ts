import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as _ from 'lodash';
import { PrecioForm } from 'src/app/model/Precio';
import { TipoEventoService } from 'src/app/services/tipo-evento.service';

@Component({
  selector: 'app-precio-tipo-evento',
  templateUrl: './precio-tipo-evento.component.html',
})
export class PrecioTipoEventoComponent implements OnInit {

  id: number = 0;
  listaPrecio: Array<PrecioForm> = [];
  listaPrecioCurrent: Array<PrecioForm> = [];
  listaPrecioNext: Array<PrecioForm> = [];
  currentYear = new Date().getFullYear();
  tipoEventoId: number = 0

  constructor(
    private tipoEventoService: TipoEventoService,
    private location: Location,
    private route: ActivatedRoute
  ) {}

  async ngOnInit(): Promise<void> {
    this.tipoEventoId = Number(this.route.snapshot.queryParamMap.get('tipoEventoId'));

    const listaPrecio = await this.tipoEventoService.getAllPrecioConFechaByTipoEventoId(
      this.tipoEventoId
    );

    if (listaPrecio.length != 0) {
      this.listaPrecio = listaPrecio;
      listaPrecio.forEach((it) => it.year == this.currentYear && this.listaPrecioCurrent.push(it));
      listaPrecio.forEach((it) => it.year == this.currentYear + 1 && this.listaPrecioNext.push(it));
    }
  }

  volver() {
    this.location.back();
  }

  async save() {
    const listaCombinada = [...this.listaPrecioCurrent, ...this.listaPrecioNext];
    await this.tipoEventoService.savePrecio(this.tipoEventoId, listaCombinada);
    this.volver();
  }

  agregarPrecioCurrent() {
    this.id -= 1;
    this.listaPrecioCurrent.push(new PrecioForm(this.id, this.currentYear, 0, 0, 0));
  }

  agregarPrecioNext() {
    this.id -= 1;
    this.listaPrecioNext.push(new PrecioForm(this.id, this.currentYear + 1, 0, 0, 0));
  }

  quitarPrecio(id: number) {
    this.listaPrecio = [...this.listaPrecioCurrent, ...this.listaPrecioNext];
    this.listaPrecio = this.listaPrecio.filter((precio) => precio.id !== id);
    this.listaPrecioCurrent = [];
    this.listaPrecioNext = [];

    this.listaPrecio.forEach((it) => it.year == this.currentYear && this.listaPrecioCurrent.push(it));
    this.listaPrecio.forEach((it) => it.year == this.currentYear + 1 && this.listaPrecioNext.push(it));
  }
}