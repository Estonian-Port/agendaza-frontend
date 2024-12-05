import { Cargo } from "./Cargo"

export type EmpresaJSON = {
    id : number
    nombre : string,
    tipo: string
}

export class Empresa{

    constructor(public id: number, public nombre: string){}
    
    static fromJson(empresaJSON: EmpresaJSON): any {
        return new Empresa(empresaJSON.id, empresaJSON.nombre)
    }

    // Se usa en el filtro de header
    contiene(palabra: string): boolean {
        return (this.nombre.toUpperCase() || '').includes(palabra.toUpperCase())
    }
}

export type EmpresaAbmJSON = {
    id : number
    nombre : string,
    tipo: string,
    tipoCargo: Cargo,
    email: string,
    telefono : number,
    calle: string,
    numero: number,
    municipio: string
}

export class EmpresaAbm {
    // Definición de los atributos
    constructor(
        public id: number, public nombre: string, public tipo: string, public tipoCargo: Cargo,
        public email: string, public telefono: number, public calle: string, public numero: number,
        public municipio: string
    ) {}

    // Método estático para convertir un objeto JSON en una instancia de EmpresaAbm
    static fromJson(empresaAbmJSON: EmpresaAbmJSON): EmpresaAbm {
        return new EmpresaAbm(
            empresaAbmJSON.id,
            empresaAbmJSON.nombre,
            empresaAbmJSON.tipo,
            empresaAbmJSON.tipoCargo,
            empresaAbmJSON.email,
            empresaAbmJSON.telefono,
            empresaAbmJSON.calle,
            empresaAbmJSON.numero,
            empresaAbmJSON.municipio
        );
    }

    // Método para realizar el filtro basado en el nombre
    contiene(palabra: string): boolean {
        return (this.nombre.toUpperCase() || '').includes(palabra.toUpperCase());
    }
}