export type ExtraJSON = {
    id : number
    nombre : string
    tipoExtra : string
    empresaId: number
    listaTipoEventoId : Array<number>
    precio : number
}

export class Extra{

    constructor(public id: number, public nombre: string, public tipoExtra : string, public empresaId: number,  public listaTipoEventoId : Array<number>  = [], public precio : number){}
    
    static fromJson(ExtraJSON: ExtraJSON): any {
        return new Extra(ExtraJSON.id, ExtraJSON.nombre, ExtraJSON.tipoExtra, ExtraJSON.empresaId, ExtraJSON.listaTipoEventoId, ExtraJSON.precio)
    }

    // Se usa en el filtro de header
    contiene(palabra: string): boolean {
        return (this.nombre.toUpperCase() || '').includes(palabra.toUpperCase())
    }

    static fromDTO(dto: ExtraPrecioDTO, empresaId: number): Extra {
        // Asignamos el empresaId y dejamos la lista de eventos vacía ya que viene filtrada
        return new Extra(dto.id, dto.nombre, dto.tipoExtra, empresaId, [], dto.precio);
    }
}

export type ExtraVariableJSON = {
    id : number
    nombre : string
    cantidad : number
    precio : number
}

export class ExtraVariable{

    constructor(public id: number, public nombre : string, public cantidad : number, public precio : number){}
    
    static fromJson(extraVariableJSON: ExtraVariableJSON): any {
        return new ExtraVariable(extraVariableJSON.id, extraVariableJSON.nombre, extraVariableJSON.cantidad, extraVariableJSON.precio)
       }

    static fromDTO(dto: ExtraPrecioDTO): ExtraVariable {
        return new ExtraVariable(dto.id, dto.nombre, 0, dto.precio);
    }
}

export interface ExtraPrecioDTO {
    id: number;
    nombre: string;
    tipoExtra: string;
    precio: number;
}

