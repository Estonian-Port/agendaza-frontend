export type AgendaCardJSON = {
    id : number,
    nombre : String,
    rol : String,
}

export class AgendaCard {
    constructor(public id : number, public nombre : String, public rol : String) {}
    
    
    static fromJson(agendaCardJSON: AgendaCardJSON): AgendaCard {
        return new AgendaCard(agendaCardJSON.id, agendaCardJSON.nombre, agendaCardJSON.rol)
    }

}