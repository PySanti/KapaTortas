enum EstadoEnum {
  PENDIENTE = 'pendiente',
  CANCELADO = 'cancelado',
  FINALIZADO = 'finalizado',
}

enum MetodoPago {
  ZELLE = 'zelle',
  PAGO_MOVIL = 'pago_movil',
  STRIPE = 'stripe',
}

enum MetodoEntrega {
  PICKUP = 'pickup',
  DELIVERY = 'delivery',
}

export interface Pedido {
  numero_de_orden: number;
  fecha_pedido: string;
  monto_total: string;
  estado: EstadoEnum;
  metodo_pago: MetodoPago;
  metodo_entrega: MetodoEntrega;
  descripciones: Descripcion[];
}

export interface Descripcion {
  titulo: string;
  presentacion: string;
  precio_presentacion: string;
  cantidad: number;
  imagenes_producto: string[];
}
