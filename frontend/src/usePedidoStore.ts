import { create } from 'zustand';
import { Producto, Presentacion } from '@/app/models/Producto';

type PedidoState = {
    product: Producto;
    extras?: Producto[];
    present?: Presentacion;
    setPedidoData: ( data: { product: Producto, extras: Producto[]; present: Presentacion }) => void;
};

// Define a default product
const defaultProduct: Producto = {
    id: 0,
    titulo: 'Default Producto',
    categoria: 'Default Categoria',
    descripcion: 'Default Descripción',
    presentaciones: [],
    imagenes: [],
    reviews: [],
  };

export const usePedidoStore = create<PedidoState>((set) => ({
    product: defaultProduct,
    extras: undefined,
    present: undefined,
    setPedidoData: (data) => 
        set({
        product: data.product,
        extras: data.extras,
        present: data.present,
    }),
}));