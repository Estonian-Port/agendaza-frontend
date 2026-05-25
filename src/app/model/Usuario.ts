import * as _ from 'lodash'
import { Cargo } from './Cargo'

// ==================== LOGIN ====================

export type UsuarioLoginJSON = {
  username: string
  password: string
}

export class UsuarioLogin {
  constructor(public username: string, public password: string) {}
      
  static fromJson(usuarioLoginJSON: UsuarioLoginJSON): UsuarioLogin {
    return new UsuarioLogin(usuarioLoginJSON.username, usuarioLoginJSON.password)
  }
}

// ==================== USUARIO PRINCIPAL ====================

export type UsuarioJSON = {
  id: number
  nombre: string
  apellido: string
  username: string
  password: string
  fechaNacimiento: Date
  sexo: string
  cargo: Cargo
  email: string
  celular: number
}

export class Usuario {
  constructor(
    public id: number,
    public nombre: string,
    public apellido: string,
    public username: string,
    public password: string,
    public fechaNacimiento: Date,
    public sexo: string,
    public cargo: Cargo,
    public email: string,
    public celular: number
  ) {}

  static fromJson(usuarioJson: UsuarioJSON): Usuario {
    return Object.assign(
      new Usuario(
        usuarioJson.id,
        usuarioJson.nombre,
        usuarioJson.apellido,
        usuarioJson.username,
        usuarioJson.password,
        usuarioJson.fechaNacimiento,
        usuarioJson.sexo,
        usuarioJson.cargo,
        usuarioJson.email,
        usuarioJson.celular
      )
    )
  }

  esValido(): boolean {
    return this.nombre !== '' && this.apellido !== '' && this.username !== ''
  }

  contiene(palabra: string): boolean {
    const upperPalabra = palabra.toUpperCase()
    return (
      this.nombre.toUpperCase().includes(upperPalabra) ||
      this.apellido.toUpperCase().includes(upperPalabra) ||
      this.username.toUpperCase().includes(upperPalabra)
    )
  }

  toJSON(): UsuarioJSON {
    return {
      id: this.id,
      nombre: this.nombre,
      apellido: this.apellido,
      username: this.username,
      password: this.password,
      fechaNacimiento: this.fechaNacimiento,
      cargo: this.cargo,
      sexo: this.sexo,
      email: this.email,
      celular: this.celular,
    }
  }

  getNombreCompleto(): string {
    return `${this.apellido}, ${this.nombre}`
  }
}

// ==================== PARA GUARDAR ====================

export class UsuarioSave {
  constructor(
    public usuario: Usuario,
    public empresaId: number,
    public cargo: string
  ) {}
}

// ==================== PARA EDITAR CARGO ====================

export class UsuarioEditCargo {
  constructor(
    public id: number,
    public empresaId: number,
    public cargo: Cargo
  ) {}
}

// ==================== PARA EDITAR CONTRASEÑA ====================

export class UsuarioEditPassword {
  constructor(public id: number, public password: string) {}
}

// ==================== USUARIO - EMPRESA ====================

export type UsuarioEmpresaJSON = {
  usuarioId: number
  empresaId: number
}

export class UsuarioEmpresa {
  constructor(public usuarioId: number, public empresaId: number) {}

  static fromJson(UsuarioEmpresaJSON: UsuarioEmpresaJSON): UsuarioEmpresa {
    return new UsuarioEmpresa(UsuarioEmpresaJSON.usuarioId, UsuarioEmpresaJSON.empresaId)
  }
}

// ==================== CLIENTE ====================

export class Cliente {
  constructor(
    public id: number,
    public nombre: string,
    public apellido: string,
    public rol: string,
    public email: string,
    public celular: number
  ) {}
}

// ==================== USUARIO ABM ====================

export class UsuarioAbm {
  constructor(public id: number, public nombre: string, public apellido: string) {}

  getNombreCompleto(): string {
    return `${this.apellido}, ${this.nombre}`
  }
}

// ==================== USUARIO ME (LOGUEADO) ====================

export type UsuarioMeJSON = {
  id: number
  nombre: string
  apellido: string
  username: string
  email: string
  celular: number
}

export class UsuarioMe {
  constructor(
    public id: number,
    public nombre: string,
    public apellido: string,
    public username: string,
    public email: string,
    public celular: number
  ) {}

  static fromJson(usuarioMeJson: UsuarioMeJSON): UsuarioMe {
    return Object.assign(
      new UsuarioMe(
        usuarioMeJson.id,
        usuarioMeJson.nombre,
        usuarioMeJson.apellido,
        usuarioMeJson.username,
        usuarioMeJson.email,
        usuarioMeJson.celular
      )
    )
  }

  getNombreCompleto(): string {
    return `${this.apellido}, ${this.nombre}`
  }
}
