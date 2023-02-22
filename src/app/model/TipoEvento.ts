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

export class TipoEvento{

    constructor(public id: number, public nombre: string, public cantidadDuracion: string, 
        public duracion: string, public capacidad : Capacidad, public empresaId : number){}
    
    static fromJson(tipoEventoJSON: TipoEventoJSON): any {
        return new TipoEvento(tipoEventoJSON.id, tipoEventoJSON.nombre, 
            tipoEventoJSON.cantidadDuracion.hour + ":" +  tipoEventoJSON.cantidadDuracion.minute, 
            tipoEventoJSON.duracion, tipoEventoJSON.capacidad, tipoEventoJSON.empresaId)
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