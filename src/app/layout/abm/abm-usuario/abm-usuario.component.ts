import { Component, OnInit } from '@angular/core';
import { UsuarioService } from 'src/app/services/usuario.service';
import { LoginService } from 'src/app/services/login.service';
import { Usuario } from 'src/app/model/Usuario';
import { Cargo } from 'src/app/model/Cargo';
import { FormBuilder, Validators } from '@angular/forms';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-abm-usuario',
  templateUrl: './abm-usuario.component.html',
})
export class AbmUsuarioComponent implements OnInit {

  buscar = ''
  listaItems : Array<any> = []
  cantidadRegistros : number = 0
  paginaActual : number = 0
  cantidadPaginas : number[] = []
  realizoBusqueda : Boolean = true
  readonly roles = [Cargo.ADMIN, Cargo.ENCARGADO, Cargo.EMPLEADO]
  usuarioSeleccionado: Usuario | null = null
  rolSeleccionado: Cargo = Cargo.EMPLEADO
  modalReset = false
  modalRol = false
  modalAlta = false
  enviando = false
  errorModal = ''
  formularioAlta = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    rol: [Cargo.EMPLEADO, Validators.required]
  })

  constructor(
    private usuarioService: UsuarioService,
    private loginService: LoginService,
    private formBuilder: FormBuilder,
    private toastService: ToastService
  ) { }
  
  async ngOnInit(): Promise<void> {
    this.inicializarListaItems()
  }

  async inicializarListaItems(){
    this.updatePalabraBuscar(this.buscar)
    this.paginaCero()

    if(this.buscar == ""){
      this.listaItems = await this.usuarioService.getAllEmpleados(this.paginaActual)
      this.cantidadRegistros = await this.usuarioService.getCantidadEmpleados()
    }
    else {
      this.listaItems = await this.usuarioService.getEmpleadosFiltrados(this.paginaActual,this.buscar)
      this.cantidadRegistros = await this.usuarioService.getCantidadEmpleadosFiltrados(this.buscar)
    }

    this.cantidadPaginas = new Array<number>(Math.ceil(this.cantidadRegistros / 10))
    this.updateCantidadPaginas(this.cantidadPaginas)
  }

  paginaCero(){
    if(this.realizoBusqueda){
      this.paginaActual = 0
    }
    this.realizoBusqueda = false
  }

  updateCurrentRegistro(registro: number){
    this.paginaActual = registro
  }

  updatePaginaActual(pagina : number){
    this.paginaActual = pagina
    this.inicializarListaItems()
  }

  updatePalabraBuscar(palabraBuscar: string){
    this.buscar = palabraBuscar
  }

  updateCantidadPaginas(cantidadPaginas: number[]){
    this.cantidadPaginas = cantidadPaginas
  }

  async abrirCambioRol(id: number): Promise<void> {
    this.usuarioSeleccionado = this.listaItems.find(item => item.id === id) || null
    if (!this.usuarioSeleccionado) return
    this.rolSeleccionado = await this.loginService.getCargoByUsuarioAndEmpresa(id)
    this.errorModal = ''
    this.modalRol = true
  }

  abrirReset(id: number): void {
    this.usuarioSeleccionado = this.listaItems.find(item => item.id === id) || null
    this.modalReset = !!this.usuarioSeleccionado
  }

  async resetearPassword(): Promise<void> {
    if (!this.usuarioSeleccionado) return
    try {
      await this.usuarioService.resetPassword(this.usuarioSeleccionado.id)
      this.toastService.showSuccess('La contraseña temporal fue generada y enviada por email al usuario.')
    } catch (error: any) {
      const backendError = error?.error
      this.toastService.showError(typeof backendError === 'string'
        ? backendError
        : backendError?.message || backendError?.mensaje || 'No se pudo restablecer la contraseña.')
    } finally {
      this.modalReset = false
      this.usuarioSeleccionado = null
    }
  }

  async guardarRol(): Promise<void> {
    if (!this.usuarioSeleccionado || this.enviando) return
    this.enviando = true
    this.errorModal = ''
    try {
      this.usuarioSeleccionado.cargo = this.rolSeleccionado
      await this.loginService.updateCargo(this.usuarioSeleccionado)
      this.modalRol = false
      await this.inicializarListaItems()
    } catch (error: any) {
      this.errorModal = error?.error?.message || error?.error?.mensaje || 'No se pudo actualizar el rol.'
    } finally {
      this.enviando = false
    }
  }

  abrirAlta(): void {
    this.formularioAlta.reset({ email: '', rol: Cargo.EMPLEADO })
    this.errorModal = ''
    this.modalAlta = true
  }

  async crearUsuario(): Promise<void> {
    this.formularioAlta.markAllAsTouched()
    if (this.formularioAlta.invalid || this.enviando) return
    this.enviando = true
    this.errorModal = ''
    const values = this.formularioAlta.getRawValue()
    try {
      await this.usuarioService.altaUsuario(values.email || '', values.rol || Cargo.EMPLEADO)
      this.modalAlta = false
      this.toastService.showSuccess('Usuario dado de alta correctamente.')
      await this.inicializarListaItems()
    } catch (error: any) {
      this.errorModal = error?.error?.message || error?.error?.mensaje || 'No se pudo dar de alta al usuario.'
    } finally {
      this.enviando = false
    }
  }

  async eliminar(id: number) {
    await this.loginService.deleteCargo(id)
    await this.inicializarListaItems()
  }

  updatePrimeraBusqueda(busqueda: Boolean){
    this.realizoBusqueda = busqueda

  }
}
