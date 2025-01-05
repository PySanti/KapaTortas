"use-client";

import { Input } from "../../ui/input";
import { Textarea } from "../../ui/textarea";
import { FieldErrors, UseFormRegister } from "react-hook-form";
import { DireccionFormData } from "@/app/controladores/lib/validations/direccion-schema";

export function ShippingSelector({
  register,
  errors,
}: {
  register: UseFormRegister<DireccionFormData>;
  errors: FieldErrors<DireccionFormData>;
}) {
  return (
    <div className="mt-6 grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-3">
      {/* Dirección */}
      <div className="sm:col-span-3">
        <label
          htmlFor="direccion"
          className="block text-sm font-medium text-terciary"
        >
          Dirección
        </label>
        <div className="mt-1">
          <Input
            {...register("direccion")}
            placeholder="Dirección"
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
          {errors.direccion && (
            <span className="text-opacity-40">{errors.direccion.message}</span>
          )}
        </div>
      </div>

      {/* Referencia */}
      <div className="sm:col-span-3">
        <label
          htmlFor="referencia"
          className="block text-sm font-medium text-terciary"
        >
          Referencia
        </label>
        <div className="mt-1">
          <Textarea
            {...register("referencia")}
            placeholder="Referencia"
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
          {errors.referencia && (
            <span className="text-opacity-40">{errors.referencia.message}</span>
          )}
        </div>
      </div>

      {/* Código Postal */}
      <div>
        <label
          htmlFor="codigo_postal"
          className="block text-sm font-medium text-terciary"
        >
          Código Postal
        </label>
        <div className="mt-1">
          <Input
            {...register("codigo_postal")}
            placeholder="Código Postal"
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
          {errors.codigo_postal && (
            <span className="text-opacity-40">
              {errors.codigo_postal.message}
            </span>
          )}
        </div>
      </div>

      {/* Referencia */}
      <div className="sm:col-span-3">
        <label
          htmlFor="nota"
          className="block text-sm font-medium text-terciary"
        >
          Nota
        </label>
        <div className="mt-1">
          <Textarea
            {...register("nota")}
            placeholder="Nota (Algún requerimiento especial que quieres en tú pedido o entrega)"
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
          {errors.nota && (
            <span className="text-opacity-40">{errors.nota.message}</span>
          )}
        </div>
      </div>
    </div>
  );
}
