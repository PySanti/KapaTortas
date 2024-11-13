import { Pedido } from './Pedido';
import { Perfil } from './Perfil';

export interface Cliente {
  perfil: Perfil;
  direcciones: DireccionEnvio[];
  direccion_preferida: DireccionEnvio;
  pedidos: Pedido[];
}

export interface DireccionEnvio {
  ciudad: string; // agregar a la db
  direccion: string;
  referencia: string;
  pais: string;
  estado: string;
  codigo_postal: string;
  esPreferida: boolean; // agregar a la db
}
