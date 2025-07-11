import { Component, EventEmitter, Input, Output } from '@angular/core';
import { UsuarioEditPassword } from 'src/app/model/Usuario';

@Component({
  selector: 'app-modal-password',
  templateUrl: './modal-password.component.html'
})
export class ModalPasswordComponent {

  showNewPassword = false
  showRepeatPassword= false
  repeatPassword: string = ''
  passwordsNoCoinciden: boolean = false

  @Input()
  modal = false

  @Input()
  usuarioEditPassword = new UsuarioEditPassword(0, "")

  @Output() 
  outputAceptar = new EventEmitter<number>()

  @Output() 
  outputChangeModal = new EventEmitter<boolean>()

  toggleNewPasswordVisibility() {
    this.showNewPassword = !this.showNewPassword
  }

  toggleRepeatPasswordVisibility() {
    this.showRepeatPassword = !this.showRepeatPassword
  }

  changeModal() {
    this.modal = !this.modal
    this.outputChangeModal.emit(this.modal)
    if (!this.modal) {
      this.repeatPassword = ''
      this.passwordsNoCoinciden = false
    }
  }

  aceptar() {
    if (this.usuarioEditPassword.password !== this.repeatPassword) {
      this.passwordsNoCoinciden = true
      return
    }

    this.passwordsNoCoinciden = false
    this.outputAceptar.emit()
    this.changeModal()
  }

}
