import { ExtraVariable } from "./ExtraVariable";

export class CateringEvento{

    constructor(public id: number, public cateringOtro : number, public presupuesto : number, public descripcion : string,
        public listaExtraTipoCatering : Array<number>, public listaExtraCateringVariable : Array<ExtraVariable>,){}

}
