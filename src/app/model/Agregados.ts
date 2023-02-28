import { ExtraVariable } from "./ExtraVariable";

export class Agregados{

    constructor(public id: number, public extraOtro : number, public descuento : number,
        public listaExtra : Array<number>, public listaExtraVariable : Array<ExtraVariable>){}

}
