export enum Categoria {
  ESPECIAL = "especial",
  POSTRE = "postre",
  EXTRA = "extra",
}

type Review = {
  autor_review: string;
  descripcion: string;
  calificacion: number;
};

export type Presentacion = {
  id: number;
  ref: string;
  proporcion: string;
  precio: number;
  stock: number;
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
