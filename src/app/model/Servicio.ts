export type ServicioJSON = {
    id : number
    nombre : String
}

export class Servicio{

    constructor(public id: number, public nombre: String){}
    
    static fromJson(ServicioJSON: ServicioJSON): any {
        return new Servicio(ServicioJSON.id, ServicioJSON.nombre)
       }
}
