import { Cliente } from "./Cliente";

export enum Categoria {
  POSTRE = "postre",
  EXTRA = "extra",
}

type Review = {
  cliente: Cliente;
  review: string;
  puntuacion: number;
};

export interface Presentacion {
  presentacion_id: number;
  ref?: string;
  proporcion?: string;
  precio: number;
  stock: number;
  calorias?: number;
}

export interface Producto {
  producto_id: number;
  titulo: string;
  categoria: Categoria;
  descripcion: string;
  imagenes?: string[];
  reviews?: Review[];
  presentacion?: Presentacion[];
}
