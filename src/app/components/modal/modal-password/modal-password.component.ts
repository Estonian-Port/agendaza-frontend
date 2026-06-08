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
  usuarioEditPassword : string = ""

  @Input()
  modal = false

  @Output() 
  outputAceptar = new EventEmitter<string>()

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
    if (this.usuarioEditPassword !== this.repeatPassword) {
      this.passwordsNoCoinciden = true
      return
    }

    this.passwordsNoCoinciden = false
    // Emite el valor modificado hacia el padre
    this.outputAceptar.emit(this.usuarioEditPassword)
    this.changeModal()
  }

}
