export type GenericItemEmpresaJSON = {
    id : number
    nombre : string
    empresaId : number
}

export class GenericItemEmpresa{

    constructor(public id : number, public nombre: string, public empresaId: number){}
    
    static fromJson(genericItemEmpresaJSON: GenericItemEmpresaJSON): any {
        return new GenericItemEmpresa(genericItemEmpresaJSON.id, genericItemEmpresaJSON.nombre, genericItemEmpresaJSON.empresaId)
       }
}
