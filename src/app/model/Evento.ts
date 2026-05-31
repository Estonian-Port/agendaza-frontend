import { Capacidad } from "./Capacidad"
import { Extra } from "./Extra"
import { ExtraVariable } from "./ExtraVariable"
import { TipoEventoExtra } from "./TipoEvento"
import { Cliente, UsuarioAbm } from "./Usuario"

/**
 * DTO para recibir eventos del servidor (raw JSON)
 */
export type EventoJSON = {
    id: number
    nombre: string
    capacidad: Capacidad
    codigo: string
    inicio: string
    fin: string
    tipoEventoId: number
    empresaId: number
    extraOtro: number
    descuento: number
    listaExtra: Array<Extra>
    listaExtraVariable: Array<ExtraVariable>
    cateringOtro: number
    cateringOtroDescripcion: string
    listaExtraTipoCatering: Array<Extra>
    listaExtraCateringVariable: Array<ExtraVariable>
    cliente: Cliente
    presupuesto?: number
    encargadoId: number
    estado: string
    anotaciones: string
}

/**
 * Clase Evento - Entidad principal para gestión de eventos
 * 
 * Propiedades:
 * - id: Identificador único del evento
 * - nombre: Nombre del evento (ej: "Boda García")
 * - codigo: Código único de 4 caracteres (ej: "ABCD")
 * - inicio/fin: Fechas y horas del evento
 * - tipoEventoId: Referencia al tipo de evento
 * - capacidad: Número de adultos y niños
 * - listaExtra: Extras del evento (decoración, etc)
 * - listaExtraVariable: Extras con precio variable
 * - catering: Configuración de catering
 * - cliente: Cliente que contrató el evento
 * - encargadoId: Empleado responsable
 * - estado: Estado actual (COTIZADO, CONFIRMADO, etc)
 */
export class Evento {
    constructor(
        public id: number,
        public nombre: string,
        public codigo: string,
        public inicio: string,
        public fin: string,
        public tipoEventoId: number,
        public capacidad: Capacidad,
        public empresaId: number,
        public extraOtro: number,
        public descuento: number,
        public listaExtra: Array<Extra>,
        public listaExtraVariable: Array<ExtraVariable>,
        public cateringOtro: number,
        public cateringOtroDescripcion: string,
        public listaExtraTipoCatering: Array<Extra>,
        public listaExtraCateringVariable: Array<ExtraVariable>,
        public cliente: Cliente,
        public encargadoId: number,
        public estado: string,
        public anotaciones: string
    ) { }

    /**
     * Crea una instancia de Evento a partir de JSON del servidor
     */
    static fromJson(eventoJSON: EventoJSON): Evento {
        return new Evento(
            eventoJSON.id,
            eventoJSON.nombre,
            eventoJSON.codigo,
            eventoJSON.inicio,
            eventoJSON.fin,
            eventoJSON.tipoEventoId,
            eventoJSON.capacidad,
            eventoJSON.empresaId,
            eventoJSON.extraOtro,
            eventoJSON.descuento,
            eventoJSON.listaExtra,
            eventoJSON.listaExtraVariable,
            eventoJSON.cateringOtro,
            eventoJSON.cateringOtroDescripcion,
            eventoJSON.listaExtraTipoCatering,
            eventoJSON.listaExtraCateringVariable,
            eventoJSON.cliente,
            eventoJSON.encargadoId,
            eventoJSON.estado,
            eventoJSON.anotaciones
        )
    }

    /**
     * Retorna un Evento vacío/default para inicializaciones
     */
    static getEventoVoid(): Evento {
        return new Evento(
            0, "", "", "", "", 0,
            new Capacidad(0, 0, 0),
            0,
            0, 0, [], [],
            0, "", [], [],
            new Cliente(0, "", "", "CLIENTE", "", 0),
            0,
            "COTIZADO",
            ""
        )
    }

    /**
     * Verifica si el evento contiene una palabra en nombre, código o fecha
     * Usado en filtros de búsqueda en la UI
     */
    contiene(palabra: string): boolean {
        const palabraMayus = (palabra || '').toUpperCase()
        return (this.nombre.toUpperCase() || '').includes(palabraMayus)
            || (this.codigo.toUpperCase() || '').includes(palabraMayus)
            || (this.inicio || '').includes(palabraMayus)
    }

    /**
     * Obtiene una representación legible del rango de fechas
     */
    getRangoFechas(): string {
        if (this.inicio && this.fin) {
            return `${this.inicio.split('T')[0]} - ${this.fin.split('T')[0]}`
        }
        return ''
    }

    /**
     * Obtiene la duración del evento en horas
     */
    getDuracionHoras(): number {
        if (!this.inicio || !this.fin) return 0
        const inicio = new Date(this.inicio).getTime()
        const fin = new Date(this.fin).getTime()
        return (fin - inicio) / (1000 * 60 * 60)
    }

    /**
     * Calcula capacidad total (adultos + niños)
     */
    getCapacidadTotal(): number {
        return this.capacidad.capacidadAdultos + this.capacidad.capacidadNinos
    }
}

/**
 * DTO para pagos de eventos
 * Usado en listados de pagos realizados
 */
export class EventoPago {
    constructor(
        public id: number,
        public nombre: string,
        public codigo: string,
        public precioTotal: number
    ) { }
}

/**
 * DTO para información de extras de un evento
 * Desglosa los precios de extras específicos
 */
export class EventoExtra {
    constructor(
        public id: number,
        public nombre: string,
        public codigo: string,
        public extraOtro: number,
        public descuento: number,
        public listaExtra: Array<Extra>,
        public listaExtraVariable: Array<ExtraVariable>,
        public tipoEventoExtra: TipoEventoExtra,
        public fechaEvento: string
    ) { }
}

/**
 * DTO para información de catering de un evento
 * Desglosa configuración y precios de catering
 */
export class EventoCatering {
    constructor(
        public id: number,
        public nombre: string,
        public codigo: string,
        public cateringOtro: number,
        public cateringOtroDescripcion: string,
        public listaExtraTipoCatering: Array<Extra>,
        public listaExtraCateringVariable: Array<ExtraVariable>,
        public tipoEventoId: number,
        public fechaEvento: string,
        public capacidad: Capacidad
    ) { }
}

/**
 * DTO para edición de horarios
 * Contiene solo los campos necesarios para editar inicio/fin
 */
export class EventoHora {
    constructor(
        public id: number,
        public nombre: string,
        public codigo: string,
        public inicio: string,
        public fin: string
    ) { }
}

/**
 * DTO para vista detallada de un evento (lectura)
 * Incluye todos los detalles, presupuesto, etc
 */
export class EventoVer {
    constructor(
        public id: number,
        public nombre: string,
        public codigo: string,
        public inicio: string,
        public fin: string,
        public tipoEventoNombre: string,
        public capacidad: Capacidad,
        public extraOtro: number,
        public descuento: number,
        public listaExtra: Array<Extra>,
        public listaExtraVariable: Array<ExtraVariable>,
        public cateringOtroDescripcion: string,
        public listaExtraTipoCatering: Array<Extra>,
        public listaExtraCateringVariable: Array<ExtraVariable>,
        public cliente: Cliente,
        public presupuesto: number,
        public encargado: UsuarioAbm,
        public estado: string,
        public empresa: string,
        public anotaciones: string
    ) { }

    /**
     * Calcula el total de catering según capacidad
     */
    getPresupuestoCatering(): number {
        if (!this.capacidad) return 0
        return this.capacidad.capacidadAdultos * (this.listaExtraTipoCatering?.length || 0) + this.cateringOtroDescripcion.length * 10 // Aproximación
    }

    /**
     * Obtiene solo el presupuesto de extras (sin catering)
     */
    getPresupuestoExtras(): number {
        return this.presupuesto - this.getPresupuestoCatering()
    }
}

/**
 * DTO para búsqueda de disponibilidad de horarios
 * Se envía al servidor para validar si hay conflictos
 */
export class EventoBuscarFecha {
    constructor(
        public empresaId: number,
        public desde: Date,
        public hasta: Date
    ) { }

    /**
     * Convierte las fechas a formato ISO para envío al servidor
     */
    toJSON() {
        return {
            empresaId: this.empresaId,
            desde: this.desde.toISOString(),
            hasta: this.hasta.toISOString()
        }
    }
}

/**
 * DTO para edición de capacidad
 * Consolidación de editCapacidadNinos y editCapacidadAdultos
 * 
 */
export class EventoCapacidad {
    constructor(
        public capacidadAdultos: number,
        public capacidadNinos: number
    ) { }

    /**
     * Calcula capacidad total
     */
    getTotal(): number {
        return this.capacidadAdultos + this.capacidadNinos
    }
}