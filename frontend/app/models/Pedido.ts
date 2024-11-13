import { Cliente } from "./Cliente";

enum EstadoEnum {
    PENDIENTE,
    CANCELADO,
    FINALZIADO
}

enum MetodoPago {
    ZELLE,
    PAGO_MOVIL,
    STRIPE
}

enum MetodoEntrega {
    PICKUP,
    DELIVERY
}

export interface Pedido {
    numero_de_orden: number,
    cliente: Cliente,
    monto_total: number,
    estado: EstadoEnum,
    metodo_pago: MetodoPago,
    metodo_entrega: MetodoEntrega,
}