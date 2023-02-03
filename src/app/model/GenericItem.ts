export type GenericItemJSON = {
    id : number
    nombre : String
}

export class GenericItem{

    constructor(public id: number, public nombre: String){}
    
    static fromJson(GenericItemJSON: GenericItemJSON): any {
        return new GenericItem(GenericItemJSON.id, GenericItemJSON.nombre)
       }
}
