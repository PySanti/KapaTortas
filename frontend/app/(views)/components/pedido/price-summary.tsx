"use client";

import { Precios } from "@/app/models/Pedido";

export default function PriceSummary({ precios }: { precios: Precios }) {
  return (
    <dl className="space-y-6 border-t border-secondary-light border-opacity-10 pt-6  font-medium text-secondary-light text-base">
      <div className="flex items-center justify-between">
        <dt>Subtotal</dt>
        <dd>${precios.subtotal}</dd>
      </div>

      <div className="flex items-center justify-between">
        <dt>Delivery</dt>
        <dt>${precios.deliveryPrice}</dt>
      </div>

      <div className="flex items-center justify-between">
        <dt>IVA</dt>
        <dd>${precios.iva}</dd>
      </div>

      <div className="flex items-center justify-between border-t border-white border-opacity-10 pt-6 text-secondary-light">
        <dt className="text-base">Total</dt>
        <dd className="text-base">${precios.total}</dd>
      </div>
    </dl>
  );
}
