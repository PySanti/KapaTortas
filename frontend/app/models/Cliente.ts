import { Perfil } from './Perfil';

export interface Cliente {
  perfil: Perfil;
  direcciones: DireccionesEnvio;
}

export interface DireccionesEnvio {
  direccion_1: string;
  direccion_2: string;
  pais: string;
  estado: string;
  codigo_postal: string;
}
