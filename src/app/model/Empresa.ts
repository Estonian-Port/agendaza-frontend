export type EmpresaJSON = {
    id : number
    nombre : String
}

export class Empresa{

    constructor(public id: number, public nombre: String){}
    
    static fromJson(EmpresaJSON: EmpresaJSON): any {
        return new Empresa(EmpresaJSON.id, EmpresaJSON.nombre)
       }
}
