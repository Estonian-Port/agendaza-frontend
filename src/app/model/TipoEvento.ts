export type TipoEventoJSON = {
    id : number
    nombre : String
}

export class TipoEvento{

    constructor(public id: number, public nombre: String){}
    
    static fromJson(tipoEventoJSON: TipoEventoJSON): any {
        return new TipoEvento(tipoEventoJSON.id, tipoEventoJSON.nombre)
       }
}
