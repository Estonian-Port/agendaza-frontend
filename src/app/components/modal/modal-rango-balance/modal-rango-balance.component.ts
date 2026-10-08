import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-modal-rango-balance',
  templateUrl: './modal-rango-balance.component.html'
})
export class ModalRangoBalanceComponent {

  @Input() modal = false;
  @Input() titulo = 'Descargar balance';
  @Input() balanceDesde = '';
  @Input() balanceHasta = '';
  @Input() mesActualISO = '';
  @Input() descargandoBalance = false;
  @Input() descargandoPlanilla = false;

  @Output() outputChangeModal = new EventEmitter<boolean>();
  @Output() outputConfirmar = new EventEmitter<{ desde: string; hasta: string }>();
  @Output() outputConfirmarPlanilla = new EventEmitter<{ desde: string; hasta: string }>();

  get ocupado(): boolean {
    return this.descargandoBalance || this.descargandoPlanilla;
  }

  get rangoInvalido(): boolean {
    return !this.balanceDesde || !this.balanceHasta || this.balanceDesde > this.balanceHasta;
  }

  changeModal() {
    this.modal = !this.modal;
    this.outputChangeModal.emit(this.modal);
  }

  confirmar() {
    this.outputConfirmar.emit({
      desde: this.balanceDesde,
      hasta: this.balanceHasta
    });
  }

  confirmarPlanilla() {
    this.outputConfirmarPlanilla.emit({
      desde: this.balanceDesde,
      hasta: this.balanceHasta
    });
  }
}