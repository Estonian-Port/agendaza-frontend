import { Capacidad } from "./Capacidad"
import { Time } from "./Time"

export type TipoEventoJSON = {
    id : number
    nombre : string,
    cantidadDuracion: Time
    duracion: string
    capacidad : Capacidad
    empresaId : number
}

export type TipoEventoEditJSON = {
    id : number
    nombre : string
    cantidadDuracion: string
    duracion: string
    capacidad : Capacidad
    empresaId : number
}

export class TipoEventoExtra {
    constructor(public id : number, public nombre : string, public  precio : number){}
}

export class TipoEvento{

    constructor(public id: number, public nombre: string, public cantidadDuracion: string, 
        public duracion: string, public capacidad : Capacidad, public empresaId : number){}
    
    static fromTipoEventoJson(tipoEventoJSON: TipoEventoJSON): any {
        return new TipoEvento(tipoEventoJSON.id, tipoEventoJSON.nombre, "",
            tipoEventoJSON.duracion, tipoEventoJSON.capacidad, tipoEventoJSON.empresaId)
    }

    static fromTipoEventoEditJson(tipoEventoEditJSON: TipoEventoEditJSON): any {
        return new TipoEvento(tipoEventoEditJSON.id, tipoEventoEditJSON.nombre, 
            tipoEventoEditJSON.cantidadDuracion.slice(0, 2) + ":" +  tipoEventoEditJSON.cantidadDuracion.slice(3, 5), 
            tipoEventoEditJSON.duracion, tipoEventoEditJSON.capacidad, tipoEventoEditJSON.empresaId)
    }

    // Se usa en el filtro de header
    contiene(palabra: string): boolean {
        return (this.nombre.toUpperCase() || '').includes(palabra.toUpperCase())
    }

    toJSON(): TipoEventoEditJSON {
        this.capacidad.id = 0
        
        return {
          id: this.id,
          nombre : this.nombre,
          cantidadDuracion: this.cantidadDuracion.slice(0, 2) + ":" + this.cantidadDuracion.slice(3, 5),
          duracion: this.duracion,
          capacidad : this.capacidad,
          empresaId : this.empresaId
        }
      }
}