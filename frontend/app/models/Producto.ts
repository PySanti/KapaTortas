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

export type Presentacion = {
  id: number;
  ref: string;
  proporcion: string;
  precio: string;
  stock: number;
  calorias: string;
};

export interface Producto {
  id: number;
  titulo: string;
  categoria: string;
  descripcion: string;
  presentaciones: Presentacion[];
  imagenes: string[];
  reviews: Review[];
}
