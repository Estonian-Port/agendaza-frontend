
import * as _ from 'lodash'

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
  rol: string
  email: string
}

export class Usuario {

  constructor(public id: number, public nombre: string, public apellido: string, public username: string,
    public password :string, public fechaNacimiento : Date, public sexo : string, public rol : string,
    public email : string) {}

  static fromJson(usuarioJson : UsuarioJSON) : Usuario{ 
    return  Object.assign(new Usuario(usuarioJson.id, usuarioJson.nombre, usuarioJson.apellido, 
      usuarioJson.username, usuarioJson.password, usuarioJson.fechaNacimiento, usuarioJson.sexo,
      usuarioJson.rol, usuarioJson.email))
  }

  esValido(): boolean {
    return (this.nombre!=='' && this.apellido!=='' && this.username!=='')
  }

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
      rol: this.rol,
      sexo: this.sexo,
      email: this.email
    }
  }
}
  
export class UsuarioSave {

  constructor(public usuario: Usuario, public empresaId : number, public rol : string ) {}

}