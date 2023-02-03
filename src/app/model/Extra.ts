export type ExtraJSON = {
    fromJson(Extra: ExtraJSON): any
    id : number
    nombre : String
}

export class Extra{

    constructor(public id: number, public nombre: String){}
    
    static fromJson(ExtraJSON: ExtraJSON): any {
        return new Extra(ExtraJSON.id, ExtraJSON.nombre)
       }
}
