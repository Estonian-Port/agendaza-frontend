export type EntidadJSON = {
    id : number
}

export class Entidad{

    constructor(public id: number){}
    
    static fromJson(entidadJSON: EntidadJSON): any {
        return new Entidad(entidadJSON.id)
    }

}
