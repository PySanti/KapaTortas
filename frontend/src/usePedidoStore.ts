import { create } from "zustand";
import { Producto, Presentacion } from "@/app/models/Producto";
import { persist } from "zustand/middleware";

export type CartItem = {
  product: Producto;
  present?: Presentacion;
  quantity: number;
};

type PedidoState = {
  cartItems: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (productId: number) => void;
  updateCartItem: (productId: number, quantity: number) => void;
  clearCart: () => void;
};

// Define a default product
const defaultProduct: Producto = {
  id: 0,
  titulo: "Default Producto",
  categoria: "Default Categoria",
  descripcion: "Default Descripción",
  presentaciones: [],
  imagenes: [],
  reviews: [],
};

export const usePedidoStore = create<PedidoState>()(
  persist(
    (set) => ({
      cartItems: [],
      addToCart: (item) =>
        set((state) => {
          const existingItem = state.cartItems.find(
            (cartItem) => cartItem.product.id === item.product.id,
          );

          if (existingItem) {
            // Actualizar la cantidad si ya existe
            return {
              cartItems: state.cartItems.map((cartItem) =>
                cartItem.product.id === item.product.id
                  ? { ...cartItem, quantity: cartItem.quantity + item.quantity }
                  : cartItem,
              ),
            };
          }

          // Agregar un nuevo producto al carrito
          return { cartItems: [...state.cartItems, item] };
        }),
      removeFromCart: (productId) =>
        set((state) => ({
          cartItems: state.cartItems.filter(
            (cartItem) => cartItem.product.id !== productId,
          ),
        })),
      updateCartItem: (productId, quantity) =>
        set((state) => ({
          cartItems: state.cartItems.map((cartItem) =>
            cartItem.product.id === productId
              ? { ...cartItem, quantity }
              : cartItem,
          ),
        })),
      clearCart: () => set({ cartItems: [] }),
    }),
    {
      name: "pedido-cache",
      partialize: (state) => ({ cartItems: state.cartItems }),
    },
  ),
);
