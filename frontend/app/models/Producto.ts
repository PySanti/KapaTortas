type descType = {
    caracteristicas: string, calorias: number
}

export interface Producto {
    titulo: string,
    descripcion: descType,
    precio: number,
    stock: number,
    proporcion: string[],
    imagenes?: string[],
    reviews?: string[],
}