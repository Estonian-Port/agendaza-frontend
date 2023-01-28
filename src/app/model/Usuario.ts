
import { format, getYear, isBefore, isSameDay } from 'date-fns'
import * as _ from 'lodash'
import { Entidad } from './Entidad'

export type UsuarioLoginJSON = {
  username: string, 
  password: string
}

export class UsuarioLogin {
  constructor( public username: string, public password: string) {}
      
  static fromJson(usuarioLoginJSON: UsuarioLoginJSON): any {
     return new UsuarioLogin(usuarioLoginJSON.username, usuarioLoginJSON.password)
    }
}

export type UsuarioJSON = {
  id: number
  nombre : string,
  apellido : string
	username: string,
	fechaAlta: string,
  imagen: string,
}

export type PerfilDeUsuarioJSON = {
  usuario :UsuarioJSON 
}



export class PerfilUsuario {
  constructor(
     public usuario : Usuario
      ){}

      static fromJson(perfilDeUsuarioJSON: PerfilDeUsuarioJSON) : PerfilUsuario {
        return new PerfilUsuario(
          Usuario.fromJson(perfilDeUsuarioJSON.usuario)
          )
      }


      toJSON() : PerfilDeUsuarioJSON{
        return {
          usuario : this.usuario.toJSON()
        }
      }

  }


export class Usuario implements Entidad{
  
  id!: number
  imagen!: string
  fechaAlta! : Date

  constructor(public nombre: string ="", public apellido: string="", public username: string="", public paisResidencia: string="", public  diasParaViajar = 0) {}

  static fromJson(usuarioJson : UsuarioJSON | Usuario) : Usuario{ 
    return  Object.assign(new Usuario() ,usuarioJson , {fechaAlta : new Date(usuarioJson.fechaAlta),
    } ) 
  }

  antiguedad(): number {
    return getYear(Date.now()) - getYear(this.fechaAlta)
  }

  esValido(): boolean {
    return (this.nombre!=='' && this.apellido!=='' && this.username!=='')
  }

  esValidaFechaAlta(){
    return isBefore(Date.now(), this.fechaAlta) || isSameDay(Date.now(), this.fechaAlta)
  }

  toJSON(): UsuarioJSON {

    return {
      id: this.id,
      nombre : this.nombre,
      apellido : this.apellido,
      username: this.username,
      fechaAlta: this.deDateAStringFormateado(),
      imagen : this.imagen,
    }
}

  deDateAStringFormateado(){
    return  format(this.fechaAlta, 'yyyy-MM-dd')
  }
}






