import { Pedido } from './Pedido';

export type Venta = {
  id: number;
  fecha: string;
  nota: string;
  pedido_asociado: Pedido;
};
