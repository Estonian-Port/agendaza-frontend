import { Agregados } from "./Agregados"
import { Capacidad } from "./Capacidad"
import { CateringEvento } from "./CateringEvento"
import { Pago } from "./Pago"
import { Cliente } from "./Usuario"

export type EventoJSON = {
    id: number
    nombre: string
    capacidad : Capacidad
    codigo : string
    inicio : string
    fin : string
    tipoEventoId : number
    empresaId : number
    agregados : Agregados
    catering : CateringEvento
    cliente : Cliente
    presupuesto : number
    encargadoId : number
    estado : string
}

export class Evento {
    constructor(public id : number, public nombre : string, public codigo : string, public inicio : string, 
        public fin : string, public tipoEventoId : number, public capacidad : Capacidad, public empresaId : number,
        public agregados : Agregados, public catering : CateringEvento, public cliente : Cliente, public presupuesto : number, 
        public encargadoId : number, public estado : string) {}
    
    
    static fromJson(eventoJSON: EventoJSON): Evento {
        return new Evento(eventoJSON.id, eventoJSON.nombre, eventoJSON.codigo, eventoJSON.inicio, 
            eventoJSON.fin, eventoJSON.tipoEventoId, eventoJSON.capacidad, eventoJSON.empresaId,
            eventoJSON.agregados, eventoJSON.catering, eventoJSON.cliente, eventoJSON.presupuesto, 
            eventoJSON.encargadoId, eventoJSON.estado)
    }

}

export class EventoPago{
    constructor(public id : number, public nombre : string, public codigo : string, 
        public precioTotal : number, public listaPagos : Array<Pago>){}
}