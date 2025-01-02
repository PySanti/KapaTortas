"use client";

import { useState, useMemo } from "react";
import { usePedidoStore } from "@/src/usePedidoStore";

import MainPedido from "../../components/pedido/main-pedido";
import DataPedido from "../../components/pedido/data-pedido";

import { ItemFormat } from "@/app/models/Pedido";

import { Precios } from "@/app/models/Pedido";

export default function CajaPage() {
  const { cartItems } = usePedidoStore();
  const [precios, setPrices] = useState<Precios>({
    subtotal: 0,
    iva: 0,
    total: 0,
    deliveryPrice: 0,
  });

  useMemo(() => {
    const subtotal =
      Math.round(
        cartItems.reduce((total, item) => {
          const presentPrice = Number(item.present?.precio || 0);
          return total + presentPrice * item.quantity;
        }, 0) * 100,
      ) / 100;

    const iva = Math.round(subtotal * 0.16 * 100) / 100;
    const total =
      Math.round((subtotal + precios.deliveryPrice + iva) * 100) / 100;

    setPrices((prev) => ({
      ...prev,
      subtotal,
      iva,
      total,
    }));
  }, [cartItems, precios.deliveryPrice]);

  const handleDeliveryPrecios = (price: number) => {
    setPrices((prev) => ({ ...prev, deliveryPrice: price }));
  };

  const order: ItemFormat[] = cartItems.map((item) => {
    const calculatedPrice = item.present ? Number(item.present.precio) : 0;

    return {
      title: item.product.titulo,
      quantity: item.quantity,
      price: calculatedPrice,
    };
  });

  return (
    <div className="bg-white">
      <div
        className="fixed right-0 top-0 hidden h-full w-1/2 bg-white lg:block"
        aria-hidden="true"
      />

      <div className="relative mx-auto grid max-w-7xl grid-cols-1 gap-x-16 lg:grid-cols-2 lg:px-8 lg:pt-16">
        <MainPedido precios={precios} />
        <DataPedido
          order={order}
          deliveryPriceHandler={handleDeliveryPrecios}
          total={precios.total}
        />
      </div>
    </div>
  );
}
