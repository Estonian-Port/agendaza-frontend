import { Time } from "./Time"

export type TipoEventoJSON = {
    id : number
    nombre : string,
    cantidadDuracion: Time
    duracion: string
    capacidadAdultos : number
    capacidadNinos: number,
    empresaId : number
}

export type TipoEventoEditJSON = {
    id : number
    nombre : string
    cantidadDuracion: string
    duracion: string
    capacidadAdultos : number
    capacidadNinos: number,
    empresaId : number
}

export class TipoEventoExtra {
    constructor(public id : number, public nombre : string, public  precio : number){}
}

export class TipoEvento{

    constructor(public id: number, public nombre: string, public cantidadDuracion: string, 
        public duracion: string, public capacidadAdultos : number, public capacidadNinos : number,
        public empresaId : number){}
    
    static fromTipoEventoJson(tipoEventoJSON: TipoEventoJSON): any {
        return new TipoEvento(tipoEventoJSON.id, tipoEventoJSON.nombre, "",
            tipoEventoJSON.duracion, tipoEventoJSON.capacidadAdultos, tipoEventoJSON.capacidadNinos,
            tipoEventoJSON.empresaId)
    }

    static fromTipoEventoEditJson(tipoEventoEditJSON: TipoEventoEditJSON): any {
        return new TipoEvento(tipoEventoEditJSON.id, tipoEventoEditJSON.nombre, 
            tipoEventoEditJSON.cantidadDuracion.slice(0, 2) + ":" +  tipoEventoEditJSON.cantidadDuracion.slice(3, 5), 
            tipoEventoEditJSON.duracion, tipoEventoEditJSON.capacidadAdultos, tipoEventoEditJSON.capacidadNinos,
            tipoEventoEditJSON.empresaId)
    }

    // Se usa en el filtro de header
    contiene(palabra: string): boolean {
        return (this.nombre.toUpperCase() || '').includes(palabra.toUpperCase())
    }

    toJSON(): TipoEventoEditJSON {        
        return {
          id: this.id,
          nombre : this.nombre,
          cantidadDuracion: this.cantidadDuracion.slice(0, 2) + ":" + this.cantidadDuracion.slice(3, 5),
          duracion: this.duracion,
          capacidadAdultos : this.capacidadAdultos,
          capacidadNinos : this.capacidadNinos,
          empresaId : this.empresaId
        }
      }
}