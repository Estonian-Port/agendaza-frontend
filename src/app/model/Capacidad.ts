export type CapacidadJSON = {
    capacidadAdultos : number,
    capacidadNinos: number
}

export class Capacidad{

    constructor(public capacidadAdultos: number, public capacidadNinos: number){}
    
    static fromJson(capacidadJSON: CapacidadJSON): any {
        return new Capacidad(capacidadJSON.capacidadAdultos, capacidadJSON.capacidadNinos)
    }

    static fromFormControl(capacidadAdultos: number, capacidadNinos: number): Capacidad {
        return new Capacidad(capacidadAdultos, capacidadNinos)
      }
}