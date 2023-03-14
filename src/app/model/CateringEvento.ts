import { Extra } from "./Extra";
import { ExtraVariable } from "./ExtraVariable";

export class CateringEvento{

    constructor(public id: number, public cateringOtro : number, public presupuesto : number, public descripcion : string,
        public listaExtraTipoCatering : Array<Extra>, public listaExtraCateringVariable : Array<ExtraVariable>,){}

}
