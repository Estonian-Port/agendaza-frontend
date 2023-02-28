export type ExtraVariableJSON = {
    id : number
    cantidad : number
}

export class ExtraVariable{

    constructor(public id: number, public cantidad : number){}
    
    static fromJson(extraVariableJSON: ExtraVariableJSON): any {
        return new ExtraVariable(extraVariableJSON.id, extraVariableJSON.cantidad)
       }
}
