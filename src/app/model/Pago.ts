export type PagoJSON = {
    fromJson(Pago: PagoJSON): any
    id : number
    pago : number
    codigo : string
    nombreEvento : string
    fechaDePago : Date
}

export class Pago{

    constructor(public id: number, public pago : number, public codigo : string, 
        public nombreEvento : string, public fechaDePago : Date){}
    
    static fromJson(PagoJSON: PagoJSON): any {
        return new Pago(PagoJSON.id, PagoJSON.pago, PagoJSON.codigo, 
            PagoJSON.nombreEvento, PagoJSON.fechaDePago)
       }
}
