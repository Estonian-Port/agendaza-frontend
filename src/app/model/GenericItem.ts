export type GenericItemJSON = {
    id : number
    nombre : string,
}

export class GenericItem{

    constructor(public id: number, public nombre: string){}
    
    static fromJson(genericItemJSON: GenericItemJSON): any {
        return new GenericItem(genericItemJSON.id, genericItemJSON.nombre)
    }
}
