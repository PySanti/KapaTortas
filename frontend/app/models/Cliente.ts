import { Perfil } from './Perfil';

export interface Cliente {
  perfil: Perfil;
  direcciones: DireccionEnvio[];
}

export interface DireccionEnvio {
  ciudad: string; // agregar a la db
  direccion_1: string;
  direccion_2: string;
  pais: string;
  estado: string;
  codigo_postal: string;
  esPreferida: boolean; // agregar a la db
  numero_telefono: string; // agregar a la db
  nombre_recibidor: string; // agregar a la db
}
