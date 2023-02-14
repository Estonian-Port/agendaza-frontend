import { GenericItem } from "./GenericItem"

export type GenericItemJSON = {
    id : number
    nombre : String
}

export class GenericItemEmpresa{

    constructor(public empresaId: number, public genericItemDto: GenericItem){}
    
    static fromJson(GenericItemJSON: GenericItemJSON): any {
        return new GenericItem(GenericItemJSON.id, GenericItemJSON.nombre)
       }
}
