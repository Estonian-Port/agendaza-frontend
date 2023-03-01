import { Agregados } from "./Agregados"
import { Capacidad } from "./Capacidad"
import { CateringEvento } from "./CateringEvento"
import { Cliente } from "./Usuario"

export type EventoJSON = {
    id: number
    nombre: string
    capacidad : Capacidad
    codigo : string
    inicio : Date
    fin : Date
    tipoEventoId : number
    empresaId : number
    agregados : Agregados
    catering : CateringEvento
    cliente : Cliente
    presupuesto : number
}

export class Evento {
    constructor(public id : number, public nombre : string, public codigo : string, public inicio : Date, 
        public fin : Date, public tipoEventoId : number, public capacidad : Capacidad, public empresaId : number,
        public agregados : Agregados, public catering : CateringEvento, public cliente : Cliente, public presupuesto : number) {}
    
    
    static fromJson(eventoJSON: EventoJSON): Evento {
        return new Evento(eventoJSON.id, eventoJSON.nombre, eventoJSON.codigo, eventoJSON.inicio, 
            eventoJSON.fin, eventoJSON.tipoEventoId, eventoJSON.capacidad, eventoJSON.empresaId,
            eventoJSON.agregados, eventoJSON.catering, eventoJSON.cliente, eventoJSON.presupuesto)
    }

}