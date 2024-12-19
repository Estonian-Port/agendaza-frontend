export type EspecificacionJSON = {
    nombre: string
    detalle: string
}

export class Especificacion{

    constructor(public nombre: string, public detalle: string){}
    
    static fromJson(especificacionJSON: EspecificacionJSON): any {
        return new Especificacion(especificacionJSON.nombre, especificacionJSON.detalle)
    }

    // Se usa en el filtro de header
    contiene(palabra: string): boolean {
        return (this.nombre.toUpperCase() || '').includes(palabra.toUpperCase())
    }
}
