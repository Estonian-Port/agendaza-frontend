export type PagoJSON = {
    fromJson(Pago: PagoJSON): any
    id : number
    monto : number
    codigo : string
    nombreEvento : string
    medioDePago : string
    fecha : Date
}

export class Pago{

    constructor(public id: number, public monto : number, public codigo : string, 
        public nombreEvento : string, public medioDePago : string, public fecha : Date){}
    
    static fromJson(PagoJSON: PagoJSON): any {
        return new Pago(PagoJSON.id, PagoJSON.monto, PagoJSON.codigo, 
            PagoJSON.nombreEvento, PagoJSON.medioDePago, PagoJSON.fecha)
       }
}

export class CodigoEmpresaId{
    constructor(public codigo : string, public empresaId : number){}
    
}
