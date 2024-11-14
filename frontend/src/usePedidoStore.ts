import { create } from 'zustand';
import { Producto, Presentacion } from '@/app/models/Producto';

type PedidoState = {
    product?: Producto;
    extras?: Producto[];
    present?: Presentacion;
    setPedidoData: ( data: { product: Producto, extras: Producto[]; present: Presentacion }) => void;
};

export const usePedidoStore = create<PedidoState>((set) => ({
    product: undefined,
    extras: undefined,
    present: undefined,
    setPedidoData: (data) => 
        set({
        product: data.product,
        extras: data.extras,
        present: data.present,
    }),
}));