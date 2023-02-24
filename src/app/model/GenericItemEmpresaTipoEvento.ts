export type GenericItemEmpresaTipoEventoJSON = {
    id : number
    nombre : string
    empresaId : number
    listaTipoEventoId : Array<number>
}

export class GenericItemEmpresaTipoEvento{

    constructor(public id : number, public nombre: string, public empresaId: number, public listaTipoEventoId : Array<number>  = []){}
    
    static fromJson(genericItemEmpresaTipoEventoJSON: GenericItemEmpresaTipoEventoJSON): any {
        return new GenericItemEmpresaTipoEvento(genericItemEmpresaTipoEventoJSON.id, genericItemEmpresaTipoEventoJSON.nombre, 
            genericItemEmpresaTipoEventoJSON.empresaId, genericItemEmpresaTipoEventoJSON.listaTipoEventoId)
       }
}
