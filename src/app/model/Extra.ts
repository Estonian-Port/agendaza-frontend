export type ExtraJSON = {
    fromJson(Extra: ExtraJSON): any
    id : number
    nombre : String
    tipoExtra : String
    empresaId: number
    listaTipoEventoId : Array<number>

}

export class Extra{

    constructor(public id: number, public nombre: String, public tipoExtra : String, public empresaId: number,  public listaTipoEventoId : Array<number>  = []){}
    
    static fromJson(ExtraJSON: ExtraJSON): any {
        return new Extra(ExtraJSON.id, ExtraJSON.nombre, ExtraJSON.tipoExtra, ExtraJSON.empresaId, ExtraJSON.listaTipoEventoId)
       }
}
