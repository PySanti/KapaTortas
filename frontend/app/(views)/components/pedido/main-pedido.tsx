"use client";

import { Divider } from "@nextui-org/divider";
import { Button } from "../ui/button";
import GalleryImage from "../images/GalleryImage";
import QuantityCard from "../quantity-card";
import PriceSummary from "./price-summary";
import DiscardItem from "./discard-item";
import { usePedidoStore } from "@/src/usePedidoStore";
import { Categoria } from "@/app/models/Producto";

import { Precios } from "@/app/models/Pedido";

export default function MainPedido({ precios }: { precios: Precios }) {
  const { cartItems, updateCartItem, removeFromCart, clearCart, quantity } =
    usePedidoStore();

  return (
    <section className="bg-terciary border-4 border-terciary-muted py-6 md:py-12 text-indigo-300 md:px-10 lg:col-start-2 lg:row-start-1 lg:mx-auto rounded-t-xl lg:w-full lg:max-w-lg">
      <div className="mx-auto max-w-2xl px-4 lg:max-w-none lg:px-0">
        <h2 className="sr-only">Order summary</h2>

        <div className="flex justify-between items-center">
          <div className="flex flex-col ">
            <h2 className="mt-1 text-xl md:text-3xl font-bold tracking-tight text-secondary-light">
              Lista de Productos
            </h2>
            <span>
              {quantity === 1
                ? `(${quantity}) Producto`
                : `(${quantity}) Productos`}
            </span>
          </div>
          <Button variant="destructive" onClick={clearCart}>
            Borrar Carrito
          </Button>
        </div>

        <Divider className="bg-terciary-muted mt-2 bg-opacity-40" />

        {/* SECCION PRODUCTOS */}

        <ul
          role="list"
          className="divide-y divide-white divide-opacity-10 text-sm font-medium"
        >
          {cartItems.map((item, index) => (
            <li key={index} className="flex flex-col py-4 px-2 justify-between">
              {/* Remover del Carrito */}
              <DiscardItem item={item} removeFromCart={removeFromCart} />

              <div className="flex items-start space-x-4">
                <GalleryImage
                  path={
                    item.product?.imagenes && item.product.imagenes.length > 0
                      ? item.product.imagenes[0]
                      : ""
                  }
                  alt={item.product.titulo}
                  className="h-20 w-20 flex-none rounded-md object-cover object-center"
                />
                <div className="flex-auto">
                  <h3 className="text-secondary-light">
                    {item.product.titulo}
                  </h3>
                  <p className="text-secondary text-lg text-opacity-70">
                    {item.product.categoria !== Categoria.ESPECIAL
                      ? item.present && item.present.proporcion
                      : item.id}
                  </p>
                </div>
                <h3 className="flex-none text-lg font-medium text-secondary">
                  {item.present ? `$${item.present.precio}` : "EXTRA"}
                </h3>
              </div>

              {/* Cantidad del Producto */}
              <QuantityCard item={item} updateCartItem={updateCartItem} />
            </li>
          ))}
        </ul>

        {/* Lista de Precios */}
        <PriceSummary precios={precios} />
      </div>
    </section>
  );
}
