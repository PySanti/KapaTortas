// Cambiar esto
export enum EstadoEnum {
  PENDIENTE = "pendiente",
  CANCELADO = "cancelado",
  FINALIZADO = "finalizado",
}

export enum MetodoPago {
  ZELLE = "zelle",
  PAGO_MOVIL = "pago_movil",
  STRIPE = "stripe",
}

export enum MetodoEntrega {
  PICKUP = "pickup",
  DELIVERY = "delivery",
}

export type formatDescripciones = {
  cantidad: number;
  id_producto: number;
  id_presentacion: number;
};

// Precios front

export type Precios = {
  subtotal: number;
  iva: number;
  total: number;
  deliveryPrice: number;
};

// WS

export type ItemFormat = {
  title: string;
  quantity: number;
  price: number;
};

export interface Pedido {
  numero_de_orden: number;
  fecha_pedido: string;
  fecha_entrega: string;
  monto_total: number;
  estado: EstadoEnum;
  metodo_pago: MetodoPago;
  metodo_entrega: MetodoEntrega;
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
  is_favorite?: boolean;
}

export interface Descripcion {
  titulo: string;
  id_producto_asociado: number;
  presentacion: string;
  precio_presentacion: number;
  cantidad: number;
  imagenes_producto: string[];
}
