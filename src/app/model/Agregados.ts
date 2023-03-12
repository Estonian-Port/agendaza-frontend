import { Extra } from "./Extra";
import { ExtraVariable } from "./ExtraVariable";

export class Agregados{

    constructor(public id: number, public extraOtro : number, public descuento : number,
        public listaExtra : Array<number>, public listaExtraVariable : Array<ExtraVariable>){}

}

export class AgregadosEdit{

    constructor(public id: number, public extraOtro : number, public descuento : number,
        public listaExtra : Array<Extra>, public listaExtraVariable : Array<ExtraVariable>){}

}
