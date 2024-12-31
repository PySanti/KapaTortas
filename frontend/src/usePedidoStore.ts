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
  quantity: number;
  addToCart: (item: CartItem) => void;
  removeFromCart: (productId: number) => void;
  updateCartItem: (productId: number, quantity: number) => void;
  clearCart: () => void;
};

export const usePedidoStore = create<PedidoState>()(
  persist(
    (set) => ({
      cartItems: [],
      quantity: 0,
      addToCart: (item) =>
        set((state) => {
          const existingItem = state.cartItems.find(
            (cartItem) => cartItem.product.id === item.product.id,
          );

          let updatedCartItems;

          if (existingItem) {
            // Update the quantity of the existing item
            updatedCartItems = state.cartItems.map((cartItem) =>
              cartItem.product.id === item.product.id
                ? { ...cartItem, quantity: cartItem.quantity + item.quantity }
                : cartItem,
            );
          } else {
            // Add a new item to the cart
            updatedCartItems = [...state.cartItems, item];
          }

          return {
            cartItems: updatedCartItems,
            quantity: updatedCartItems.reduce(
              (total, cartItem) => total + cartItem.quantity,
              0,
            ),
          };
        }),
      removeFromCart: (productId) =>
        set((state) => {
          const updatedCartItems = state.cartItems.filter(
            (cartItem) => cartItem.product.id !== productId,
          );

          return {
            cartItems: updatedCartItems,
            quantity: updatedCartItems.reduce(
              (total, cartItem) => total + cartItem.quantity,
              0,
            ),
          };
        }),
      updateCartItem: (productId, quantity) =>
        set((state) => {
          const updatedCartItems = state.cartItems.map((cartItem) =>
            cartItem.product.id === productId
              ? { ...cartItem, quantity }
              : cartItem,
          );

          return {
            cartItems: updatedCartItems,
            quantity: updatedCartItems.reduce(
              (total, cartItem) => total + cartItem.quantity,
              0,
            ),
          };
        }),
      clearCart: () => set({ cartItems: [], quantity: 0 }),
    }),
    {
      name: "pedido-cache",
      partialize: (state) => ({ cartItems: state.cartItems }),
    },
  ),
);
