export class PrecioForm {
  constructor(
    public id: number,
    public year: number,
    public desde: number,
    public hasta: number,
    public precio: number
  ) {}
}

export type PrecioJSON = {
  id: number;
  desde: string;
  hasta: string;
  precio: number;
  empresaId: number;
  itemId: number;
};

export class Precio {
  constructor(
    public id: number,
    public desde: string,
    public hasta: string,
    public precio: number,
    public empresaId: number,
    public itemId: number
  ) {}

  static fromJson(precioJSON: PrecioJSON): Precio {
    return new Precio(
      precioJSON.id,
      precioJSON.desde,
      precioJSON.hasta,
      precioJSON.precio,
      precioJSON.empresaId,
      precioJSON.itemId
    );
  }

  static fromForm(precioForm: PrecioForm, empresaId: number, itemId: number): Precio {
    // 1. Formateamos los meses a dos dígitos (ej: 2 pasa a "02")
    // Como Date() usaba meses base 0, le sumamos 1 para que "1" sea Enero.
    const mesDesde = String(Number(precioForm.desde) + 1).padStart(2, '0');
    const mesHasta = String(Number(precioForm.hasta) + 1).padStart(2, '0');

    // 2. Armamos el string ISO fijo para que el backend lo reciba exacto sin importar la zona horaria.
    const fechaDesdeFija = `${precioForm.year}-${mesDesde}-01T00:00:00`;
    
    // Para la fecha final, asumimos que es el último día del mes, si en tu lógica es el día 1, 
    // cambialo por "01T00:00:00" igual que arriba. Acá te lo dejo como el día 1 para mantener 
    // similitud con lo que tenías, pero ojo con eso si tu back espera fin de mes.
    const fechaHastaFija = `${precioForm.year}-${mesHasta}-01T00:00:00`;

    const idReal = precioForm.id < 0 ? 0 : precioForm.id;

    return new Precio(
      idReal,
      fechaDesdeFija,
      fechaHastaFija,
      precioForm.precio,
      empresaId,
      itemId
    );
  }

  static toForm(precio: Precio): PrecioForm {
    // Cuando el backend nos devuelve el string "2026-02-01T00:00:00"
    // Lo cortamos y sacamos los valores numéricos.
    const yearDesde = Number(precio.desde.split('-')[0]);
    
    // Restamos 1 porque el form usa meses del 0 al 11
    const mesDesdeNum = Number(precio.desde.split('-')[1]) - 1;
    const mesHastaNum = Number(precio.hasta.split('-')[1]) - 1;

    return new PrecioForm(
      precio.id,
      yearDesde,
      mesDesdeNum,
      mesHastaNum,
      precio.precio
    );
  }
}