import { Cliente } from "./Cliente"

type descType = {
    caracteristicas: string, calorias: number
}

type Review = {
    cliente: Cliente, review: string, puntuacion: number,
}

export interface Producto {
    titulo: string,
    descripcion: descType,
    precio: number,
    stock: number,
    proporcion: string[],
    imagenes?: string[],
    reviews?: Review[],
}