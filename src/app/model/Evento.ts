import { Capacidad } from "./Capacidad"

export type EventoJSON = {
    id: number
    nombre: string
    capacidad : Capacidad
    codigo : string
    inicio : Date
    fin : Date
    tipoEventoId : number
    empresaId : number
}

export class Evento {
    constructor(public id : number, public nombre : string, public codigo : string, public inicio : Date, 
        public fin : Date, public tipoEventoId : number, public capacidad : Capacidad, public empresaId : number) {}
    
    
    static fromJson(eventoJSON: EventoJSON): Evento {
        return new Evento(eventoJSON.id, eventoJSON.nombre, eventoJSON.codigo, eventoJSON.inicio, 
            eventoJSON.fin, eventoJSON.tipoEventoId, eventoJSON.capacidad, eventoJSON.empresaId)
    }

}