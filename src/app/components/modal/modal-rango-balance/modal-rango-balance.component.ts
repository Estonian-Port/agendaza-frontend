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

  @Output() outputChangeModal = new EventEmitter<boolean>();
  @Output() outputConfirmar = new EventEmitter<{ desde: string; hasta: string }>();

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
}