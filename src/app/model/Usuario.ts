import * as _ from 'lodash'
import { Cargo } from './Cargo'

export type UsuarioLoginJSON = {
  username: string
  password: string
}

export class UsuarioLogin {
  constructor(public username: string, public password: string) {}
      
  static fromJson(usuarioLoginJSON: UsuarioLoginJSON): any {
     return new UsuarioLogin(usuarioLoginJSON.username, usuarioLoginJSON.password)
    }
}

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

  constructor(public id: number, public nombre: string, public apellido: string, public username: string,
    public password :string, public fechaNacimiento : Date, public sexo : string, public cargo : Cargo,
    public email : string, public celular : number) {}

  static fromJson(usuarioJson : UsuarioJSON) : Usuario{ 
    return  Object.assign(new Usuario(usuarioJson.id, usuarioJson.nombre, usuarioJson.apellido, 
      usuarioJson.username, usuarioJson.password, usuarioJson.fechaNacimiento, usuarioJson.sexo,
      usuarioJson.cargo, usuarioJson.email, usuarioJson.celular))
  }

  esValido(): boolean {
    return (this.nombre!=='' && this.apellido!=='' && this.username!=='')
  }

  // Se usa en el filtro de header
  contiene(palabra: string): boolean {
    return (this.nombre.toUpperCase() || '').includes(palabra.toUpperCase()) 
    || (this.apellido.toUpperCase() || '').includes(palabra.toUpperCase())
    || (this.username.toUpperCase() || '').includes(palabra.toUpperCase())
  }


  toJSON(): UsuarioJSON {
    return {
      id: this.id,
      nombre : this.nombre,
      apellido : this.apellido,
      username: this.username,
      password: this.password,
      fechaNacimiento: this.fechaNacimiento,
      cargo: this.cargo,
      sexo: this.sexo,
      email: this.email,
      celular: this.celular
    }
  }
}
  
export class UsuarioSave {

  constructor(public usuario: Usuario, public empresaId : number, public cargo : string ) {}

}

export class UsuarioEditCargo {

  constructor(public id: number, public empresaId : number, public cargo : Cargo) {}

}

export class UsuarioEditPassword {

  constructor(public id: number, public password: string){}

}

export type UsuarioEmpresaJSON = {
  usuarioId : number
  empresaId : number
}

export class UsuarioEmpresa{

  constructor(public usuarioId: number, public empresaId: number){}
  
  static fromJson(UsuarioEmpresaJSON: UsuarioEmpresaJSON): any {
      return new UsuarioEmpresa(UsuarioEmpresaJSON.usuarioId, UsuarioEmpresaJSON.empresaId)
     }
}

export class Cliente{

  constructor(public id: number, public nombre: string, public apellido: string, 
    public rol : string, public email : string, public celular : number) {}
}

export class UsuarioAbm{

  constructor(public id: number, public nombre: string, public apellido: string) {}
  
  public getNombreCompleto() : string{
    return this.apellido + ", " + this.nombre.toString()
  }
}