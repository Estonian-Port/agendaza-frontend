export type EventoJSON = {
    id: number, 
    nombre: String, 
    codigo : String, 
    inicio : Date, 
    fin : Date
}

export class Evento {
    constructor(public id : number, public nombre : String, public codigo : String, public inicio : Date, public fin : Date) {}
    
    
    static fromJson(agendaEventoJSON: EventoJSON): Evento {
        return new Evento(agendaEventoJSON.id, agendaEventoJSON.nombre, agendaEventoJSON.codigo, agendaEventoJSON.inicio, agendaEventoJSON.fin)
    }

}