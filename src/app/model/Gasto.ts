export class Gasto {
    constructor(
        public id: number,
        public monto: number,
        public tipoGasto: string,
        public descripcion: string,
        public fecha: string,            // ISO local: 'yyyy-MM-ddTHH:mm'
        public empresaId: number,
        public usuarioId: number,
        public medioDePago?: string,
        public codigoEvento?: string,
        public eventoId?: number,
        public nombreEvento?: string
    ) {}

    static vacio(): Gasto {
        return new Gasto(0, 0, 'OTROS', '', Gasto.ahoraLocal(), 0, 0, 'EFECTIVO')
    }

    static ahoraLocal(): string {
        const d = new Date()
        d.setMinutes(d.getMinutes() - d.getTimezoneOffset())
        return d.toISOString().slice(0, 16)
    }
}

export interface Movimiento {
    tipo: 'INGRESO' | 'EGRESO'
    id: number
    fecha: string | Date
    titulo: string
    etiqueta: string
    monto: number
}