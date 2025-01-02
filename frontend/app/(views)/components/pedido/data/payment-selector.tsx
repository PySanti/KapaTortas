"use-client";

import { Input } from "../../ui/input";
import { MetodoPago } from "@/app/models/Pedido";
import { Dispatch, SetStateAction } from "react";

export function PaymentSelector({
  pago,
  setPago,
}: {
  pago: MetodoPago;
  setPago: Dispatch<SetStateAction<MetodoPago>>;
}) {
  const metodoPagoList = [
    { metodo: MetodoPago.ZELLE, titulo: "Zelle" },
    { metodo: MetodoPago.PAGO_MOVIL, titulo: "Pago Móvil" },
  ];

  return (
    <div className="mt-10 border-t border-primary-light pt-10">
      <h3 className="text-xl font-medium text-terciary">Método de Pago</h3>
      <fieldset className="mt-4">
        <div className="space-y-4 sm:flex sm:items-center sm:space-x-10 sm:space-y-0">
          {metodoPagoList.map((option) => (
            <div key={option.metodo} className="flex items-center">
              <Input
                name="payment-type"
                type="radio"
                value={option.metodo}
                checked={pago === option.metodo}
                onChange={() => setPago(option.metodo)}
                className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <label
                htmlFor={`payment-${option.metodo}`}
                className="ml-3 block text-sm font-medium text-terciary"
              >
                {option.titulo}
              </label>
            </div>
          ))}
        </div>
      </fieldset>
    </div>
  );
}
