"use client";

import { useState, useMemo } from "react";
import { usePedidoStore } from "@/src/usePedidoStore";

import { Cliente } from "@/app/models/Cliente";

import { ItemFormat } from "@/app/models/Pedido";
import { Categoria } from "@/app/models/Producto";

import GalleryImage from "../images/GalleryImage";
import DataPedido from "./data-pedido";
import PriceSummary from "./price-summary";

export default function MainPedido({ perfil }: { perfil: Cliente | null }) {
  const { product, extras, present } = usePedidoStore();

  const [deliveryPrice, setDeliveryPrice] = useState<number>(0);

  const SUBTOTAL = useMemo(() => {
    const presentPrice = Number(present?.precio || 0);
    const extrasTotal =
      extras?.reduce((total, item) => {
        const presentationPrice =
          item.presentaciones.length > 0
            ? Number(item.presentaciones[0]?.precio || 0)
            : 0;
        return total + presentationPrice;
      }, 0) || 0;

    return presentPrice + extrasTotal;
  }, [extras, present]);

  const IVA = useMemo(() => SUBTOTAL * 0.16, [SUBTOTAL]);
  const TOTAL = useMemo(
    () => SUBTOTAL + deliveryPrice + IVA,
    [SUBTOTAL, deliveryPrice, IVA],
  );

  const listProducts = useMemo(
    () => [product, ...(extras || [])],
    [product, extras],
  );

  const order: ItemFormat[] = listProducts.map((item) => {
    const calculatedPrice =
      item.categoria === Categoria.POSTRE
        ? Number(present?.precio)
        : item.presentaciones.length > 0
          ? Number(item.presentaciones[0].precio)
          : 0;

    return {
      title: item.titulo,
      quantity: 1,
      price: calculatedPrice,
    };
  });

  const handleDeliveryPriceChange = (price: number) => {
    setDeliveryPrice(price);
  };

  return (
    <div className="bg-white">
      {/* Separación color bg */}
      <div
        className="fixed right-0 top-0 hidden h-full w-1/2 bg-white lg:block"
        aria-hidden="true"
      />

      <div className="relative mx-auto grid max-w-7xl grid-cols-1 gap-x-16 lg:grid-cols-2 lg:px-8 lg:pt-16">
        <h1 className="sr-only">Procesar Compra</h1>

        <section className="bg-terciary py-12 text-indigo-300 md:px-10 lg:col-start-2 lg:row-start-1 lg:mx-auto lg:w-full lg:max-w-lg">
          <div className="mx-auto max-w-2xl px-4 lg:max-w-none lg:px-0">
            <h2 className="sr-only">Order summary</h2>

            <h2 className="mt-1 text-3xl font-bold tracking-tight text-secondary-light">
              Productos
            </h2>

            {/* SECCION PRODUCTOS */}

            <ul
              role="list"
              className="divide-y divide-white divide-opacity-10 text-sm font-medium"
            >
              {listProducts.map((product, index) => (
                <li key={index} className="flex items-start space-x-4 py-6">
                  <GalleryImage
                    path={
                      product?.imagenes && product.imagenes.length > 0
                        ? product.imagenes[0]
                        : ""
                    }
                    alt={product.titulo}
                    className="h-20 w-20 flex-none rounded-md object-cover object-center"
                  />
                  <div className="flex-auto space-y-1">
                    <h3 className="text-secondary-light">{product.titulo}</h3>
                    <p className="text-secondary-light text-opacity-40">
                      {present && present.proporcion}
                    </p>
                  </div>
                  <h3 className="flex-none text-lg font-medium text-secondary">
                    {product.categoria === Categoria.POSTRE
                      ? present?.precio
                      : "Extra"}
                  </h3>
                </li>
              ))}
            </ul>

            {/* SECCION PRECIOS */}
            <PriceSummary
              subtotal={SUBTOTAL}
              iva={IVA}
              total={TOTAL}
              deliveryPrice={deliveryPrice}
            />
          </div>
        </section>

        <section className="py-16 lg:col-start-1 lg:row-start-1 lg:mx-auto lg:w-full lg:max-w-kg lg:pb-24 lg:pt-0">
          <DataPedido
            perfilDir={perfil?.direccion_preferida}
            order={order}
            deliveryPriceHandler={handleDeliveryPriceChange}
            total={TOTAL}
          />
        </section>
      </div>
    </div>
  );
}
