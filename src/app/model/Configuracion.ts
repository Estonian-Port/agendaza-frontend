export type ConfiguracionJSON = {
    cantUsuarios : number,
    cantEmpresas : number,
    cantTipoEvento : number,
    cantExtras : number,
    cantPagos : number,
    cantEventos : number,
    cantCliente : number,
    cantCatering : number,
    cantServicios : number
}

export class Configuracion {

    constructor(public cantUsuarios : number, public cantEmpresas : number, public cantTipoEvento : number,
        public cantExtras : number, public cantPagos : number, public cantEventos : number, 
        public cantCliente : number, public cantCatering : number, public cantServicios : number){}

    static fromJson(configuracionJSON: ConfiguracionJSON): Configuracion {
        return new Configuracion(configuracionJSON.cantUsuarios, configuracionJSON.cantEmpresas, 
            configuracionJSON.cantTipoEvento, configuracionJSON.cantExtras, configuracionJSON.cantPagos,
            configuracionJSON.cantEventos, configuracionJSON.cantCliente, configuracionJSON.cantCatering,
            configuracionJSON.cantServicios)
    }
    
}