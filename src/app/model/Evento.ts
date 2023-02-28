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
    listaExtra : Array<Entidad>
    listaExtraVariable : Array<ExtraVariable>
    listaExtraTipoCatering : Array<Entidad>
    listaExtraCateringVariable : Array<ExtraVariable>
    cliente : Cliente
}

export class Evento {
    constructor(public id : number, public nombre : string, public codigo : string, public inicio : Date, 
        public fin : Date, public tipoEventoId : number, public capacidad : Capacidad, public empresaId : number,
        public listaExtra : Array<Entidad>, public listaExtraVariable : Array<ExtraVariable>,
        public listaExtraTipoCatering : Array<Entidad>, public listaExtraCateringVariable : Array<ExtraVariable>,
        public cliente : Cliente) {}
    
    
    static fromJson(eventoJSON: EventoJSON): Evento {
        return new Evento(eventoJSON.id, eventoJSON.nombre, eventoJSON.codigo, eventoJSON.inicio, 
            eventoJSON.fin, eventoJSON.tipoEventoId, eventoJSON.capacidad, eventoJSON.empresaId,
            eventoJSON.listaExtra, eventoJSON.listaExtraVariable, eventoJSON.listaExtraTipoCatering, eventoJSON.listaExtraCateringVariable,
            eventoJSON.cliente)
    }

}