export type PagoJSON = {
    fromJson(Pago: PagoJSON): any
    id : number
    monto : number
    codigo : string
    nombreEvento : string
    fecha : Date
}

export class Pago{

    constructor(public id: number, public monto : number, public codigo : string, 
        public nombreEvento : string, public fechaDePago : Date){}
    
    static fromJson(PagoJSON: PagoJSON): any {
        return new Pago(PagoJSON.id, PagoJSON.monto, PagoJSON.codigo, 
            PagoJSON.nombreEvento, PagoJSON.fecha)
       }
}
