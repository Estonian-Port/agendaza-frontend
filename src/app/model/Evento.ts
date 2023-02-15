export type EventoJSON = {
    id: number
    nombre: string
    codigo : string
    inicio : Date
    fin : Date
    tipoEvento : string
}

export class Evento {
    constructor(public id : number, public nombre : string, public codigo : string, public inicio : Date, public fin : Date, public tipoEvento : string) {}
    
    
    static fromJson(agendaEventoJSON: EventoJSON): Evento {
        return new Evento(agendaEventoJSON.id, agendaEventoJSON.nombre, agendaEventoJSON.codigo, agendaEventoJSON.inicio, agendaEventoJSON.fin, agendaEventoJSON.tipoEvento)
    }

}