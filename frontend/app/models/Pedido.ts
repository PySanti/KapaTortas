export enum EstadoEnum {
  PENDIENTE = 'pendiente',
  CANCELADO = 'cancelado',
  FINALIZADO = 'finalizado',
}

export enum MetodoPago {
  ZELLE = 'zelle',
  PAGO_MOVIL = 'pago_movil',
  STRIPE = 'stripe',
}

export enum MetodoEntrega {
  PICKUP = 'pickup',
  DELIVERY = 'delivery',
}

export interface Pedido {
  numero_de_orden: number;
  fecha_pedido: string;
  fecha_entrega: string;
  monto_total: string;
  estado: string;
  metodo_pago: string;
  metodo_entrega: string;
  direccion_entrega: DireccionEntrega;
  descripciones: Descripcion[];
}

export interface DireccionEntrega {
  id: number;
  pais: string;
  estado: string;
  ciudad: string;
  direccion: string;
  referencia: string;
  codigo_postal: number;
}

export interface Descripcion {
  titulo: string;
  id_producto_asociado: number;
  presentacion: string;
  precio_presentacion: string;
  cantidad: number;
  imagenes_producto: string[];
}
