import { create } from "zustand";
import { Producto, Presentacion } from "@/app/models/Producto";
import { persist } from "zustand/middleware";
import { Categoria } from "@/app/models/Producto";

export type CartItem = {
  id: string;
  product: Producto;
  present?: Presentacion;
  quantity: number;
};

type PedidoState = {
  cartItems: CartItem[];
  quantity: number;
  checkSameItem: (item: CartItem) => boolean;
  addToCart: (item: CartItem) => void;
  removeFromCart: (productId: string) => void;
  updateCartItem: (productId: string, quantity: number) => void;
  clearCart: () => void;
  setNota: (message: string | undefined) => string;
};

export const usePedidoStore = create<PedidoState>()(
  persist(
    (set, get) => ({
      cartItems: [],
      quantity: 0,
      checkSameItem: (item) => {
        const state = get();

        if (item.product.categoria === Categoria.ESPECIAL) {
          return state.cartItems.some((cartItem) => cartItem.id === item.id);
        }

        return state.cartItems.some(
          (cartItem) =>
            cartItem.product.id === item.product.id &&
            cartItem.present?.id === item.present?.id,
        );
      },
      addToCart: (item) =>
        set((state) => {
          const existingItem = state.cartItems.find(
            (cartItem) => cartItem.id === item.id,
          );

          let updatedCartItems;

          if (existingItem) {
            // Update the quantity of the existing item
            updatedCartItems = state.cartItems.map((cartItem) =>
              cartItem.id === item.id
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
            (cartItem) => cartItem.id !== productId,
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
            cartItem.id === productId ? { ...cartItem, quantity } : cartItem,
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
      setNota: (message) => {
        const state = get();
        const formattedMessage = state.cartItems
          .map((cartItem) => {
            return cartItem.product.categoria === Categoria.ESPECIAL
              ? `${cartItem.product.titulo}: \n Sabores: ${cartItem.id}, Cantidad: ${cartItem.quantity}`
              : null;
          })
          .filter(Boolean)
          .join("\n");

        if (message === "") {
          return "no hay requerimientos especiales";
        }

        return [message, formattedMessage].join("\n" + "\n");
      },
    }),
    {
      name: "pedido-cache",
      partialize: (state) => ({ cartItems: state.cartItems }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.quantity = state.cartItems.reduce(
            (total, cartItem) => total + cartItem.quantity,
            0,
          );
        }
      },
    },
  ),
);
