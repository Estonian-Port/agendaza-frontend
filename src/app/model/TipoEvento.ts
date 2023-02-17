import { Capacidad } from "./Capacidad"

export type TipoEventoJSON = {
    id : number
    nombre : string,
    cantidadDuracion: number
    duracion: string
    capacidad : Capacidad
    empresaId : number
}

export class TipoEvento{

    constructor(public id: number, public nombre: string, public cantidadDuracion: number, 
        public duracion: string, public capacidad : Capacidad, public empresaId : number){}
    
    static fromJson(tipoEventoJSON: TipoEventoJSON): any {
        return new TipoEvento(tipoEventoJSON.id, tipoEventoJSON.nombre, tipoEventoJSON.cantidadDuracion, 
            tipoEventoJSON.duracion, tipoEventoJSON.capacidad, tipoEventoJSON.empresaId)
    }

    // Se usa en el filtro de header
    contiene(palabra: string): boolean {
        return (this.nombre.toUpperCase() || '').includes(palabra.toUpperCase())
    }
}