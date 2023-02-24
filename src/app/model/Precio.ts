export type PrecioJSON = {
    id : number
    desde : Date
    hasta : Date
    precio : number
    empresaId : number
    itemId : number
}

export class Precio{

    constructor(public id : number, public desde : Date, public hasta : Date, public precio : number,
        public empresaId : number, public itemId : number){}
    
    static fromJson(precioJSON: PrecioJSON): any {
        return new Precio(precioJSON.id, precioJSON.desde, precioJSON.hasta, precioJSON.precio,
            precioJSON.empresaId, precioJSON.itemId)
    }

    static fromForm(precioForm : PrecioForm, empresaId : number, itemId : number){
        return new Precio(0, new Date(precioForm.year, precioForm.desde), new Date(precioForm.year,precioForm.hasta), precioForm.precio, empresaId, itemId)
    }

}

export class PrecioForm{

    constructor(public id : number, public year : number, public desde : number, public hasta : number,
        public precio : number){}

}
