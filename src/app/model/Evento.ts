import { Agregados } from "./Agregados"
import { Capacidad } from "./Capacidad"
import { Entidad } from "./Entidad"
import { ExtraVariable } from "./ExtraVariable"
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
    listaExtraTipoCatering : Array<number>
    listaExtraCateringVariable : Array<ExtraVariable>
    cliente : Cliente
    agregados : Agregados
}

export class Evento {
    constructor(public id : number, public nombre : string, public codigo : string, public inicio : Date, 
        public fin : Date, public tipoEventoId : number, public capacidad : Capacidad, public empresaId : number,
        public agregados : Agregados,
        public listaExtraTipoCatering : Array<number>, public listaExtraCateringVariable : Array<ExtraVariable>,
        public cliente : Cliente) {}
    
    
    static fromJson(eventoJSON: EventoJSON): Evento {
        return new Evento(eventoJSON.id, eventoJSON.nombre, eventoJSON.codigo, eventoJSON.inicio, 
            eventoJSON.fin, eventoJSON.tipoEventoId, eventoJSON.capacidad, eventoJSON.empresaId,
            eventoJSON.agregados, eventoJSON.listaExtraTipoCatering, eventoJSON.listaExtraCateringVariable,
            eventoJSON.cliente)
    }

}