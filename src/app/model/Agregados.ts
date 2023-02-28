import { Entidad } from "./Entidad";
import { ExtraVariable } from "./ExtraVariable";

export class Agregados{

    constructor(public id: number, public extraOtro : number, public descuento : number,
        public listaExtra : Array<Entidad>, public listaExtraVariable : Array<ExtraVariable>){}

}
