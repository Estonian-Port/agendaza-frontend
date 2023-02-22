import { Capacidad } from "./Capacidad"
import { GenericItem } from "./GenericItem"
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
    nombre : string,
    cantidadDuracion: string
    duracion: string
    capacidad : Capacidad
    empresa : GenericItem
}

export class TipoEvento{

    constructor(public id: number, public nombre: string, public cantidadDuracion: string, 
        public duracion: string, public capacidad : Capacidad, public empresaId : number){}
    
    static fromJson(tipoEventoEditJSON: TipoEventoEditJSON): any {
        return new TipoEvento(tipoEventoEditJSON.id, tipoEventoEditJSON.nombre, 
            tipoEventoEditJSON.cantidadDuracion.slice(0, 2) + ":" +  tipoEventoEditJSON.cantidadDuracion.slice(3, 5), 
            tipoEventoEditJSON.duracion, tipoEventoEditJSON.capacidad, tipoEventoEditJSON.empresa.id)
    }

    // Se usa en el filtro de header
    contiene(palabra: string): boolean {
        return (this.nombre.toUpperCase() || '').includes(palabra.toUpperCase())
    }

    toJSON(): TipoEventoJSON {
        return {
          id: this.id,
          nombre : this.nombre,
          cantidadDuracion: new Time(this.cantidadDuracion.slice(0, 2), this.cantidadDuracion.slice(3, 5)),
          duracion: this.duracion,
          capacidad : this.capacidad,
          empresaId : this.empresaId
        }
      }
}