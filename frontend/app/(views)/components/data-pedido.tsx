"use-client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { formatDescripciones, ItemFormat } from "@/app/models/Pedido";
import { Button } from "./ui/button";
import { OrderDetails } from "@/app/models/Pedido";

import { DireccionEnvio } from "@/app/models/Cliente";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { useState } from "react";
import { MetodoEntrega, MetodoPago } from "@/app/models/Pedido";
import { Description, Label, Radio, RadioGroup } from "@headlessui/react";
import classNames from "@/app/controladores/utilities/classNames";

import { CheckCircleIcon } from "lucide-react";
import redirectToWhatsapp from "@/app/controladores/utilities/redirect-to-whatsapp";

//   Esquema
// Define Zod schema for validation with min(1) instead of nonempty()
const direccionSchema = z.object({
  direccion: z.string().min(1, "La dirección es requerida"),
  referencia: z.string().optional(), // Reference can be optional
  codigo_postal: z
    .string()
    .min(1, "El código postal es requerido")
    .transform((val) => parseInt(val, 10)) // Convert string input to number
    .refine((val) => !isNaN(val) && val >= 1000 && val <= 99999, {
      message: "Código postal inválido",
    }),
});

// Direccion
type DireccionFormData = z.infer<typeof direccionSchema>;

// Default values
const deliveryMetodosList = [
  { metodo: "delivery", precio: 3 },
  { metodo: "pickup", precio: 0 },
];
const metodoPagoList = [
  { metodo: "zelle", titulo: "Zelle" },
  { metodo: "pago_movil", titulo: "Pago Móvil" },
];

export default function DataPedido({
  perfilDir,
  order,
  deliveryPriceHandler,
  total,
}: {
  perfilDir: DireccionEnvio | undefined;
  order: ItemFormat[];
  deliveryPriceHandler: (item: number) => void;
  total: number;
}) {
  // Opciones
  const [delivery, setDelivery] = useState<MetodoEntrega>(
    MetodoEntrega.DELIVERY,
  );
  const [pago, setPago] = useState<MetodoPago>(MetodoPago.PAGO_MOVIL);

  const defaultValues = {
    direccion: perfilDir?.direccion || "",
    referencia: perfilDir?.referencia || "",
    codigo_postal: perfilDir?.codigo_postal
      ? parseInt(perfilDir.codigo_postal, 10)
      : 1000,
  };

  // Schema
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DireccionFormData>({
    resolver: zodResolver(direccionSchema),
    defaultValues,
  });

  // Change handler to set the selected payment method
  const PagoHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value as MetodoPago;
    console.log(value);
    setPago(value);
  };

  // On submit, build the complete order details object
  const onSubmit = (data: DireccionFormData) => {
    const orderDetails: OrderDetails = {
      price: total,
      items: order,
      address: {
        direccion: data.direccion,
        referencia: data.referencia,
        codigo_postal: data.codigo_postal.toString(),
      },
      deliveryMethod: delivery,
      paymentMethod: pago,
    };

    // Here you can call your redirect or API submission with the orderDetails
    console.log(orderDetails);

    redirectToWhatsapp({ variant: "pedido", orderDetails });
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mx-auto max-w-2xl px-4 lg:max-w-none lg:px-0">
          <div className="mt-10">
            <h3 className="text-2xl font-medium text-terciary">
              Dirección de Envío
            </h3>
            {/* Direccion */}

            <div className="mt-6 grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-3">
              <div className="sm:col-span-3">
                <label
                  htmlFor="address"
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
                    <span className="text-opacity-40">
                      {errors.direccion.message}
                    </span>
                  )}
                </div>
              </div>

              <div className="sm:col-span-3">
                <label className="block text-sm font-medium text-terciary">
                  <div>
                    <label className="block text-sm font-medium text-terciary">
                      Referencia
                    </label>
                    <div className="mt-1">
                      <Textarea
                        {...register("referencia")}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-light focus:ring-primary sm:text-sm"
                        placeholder="Referencia"
                      />
                      {errors.referencia && (
                        <span className="text-opacity-40">
                          {errors.referencia.message}
                        </span>
                      )}
                    </div>
                  </div>
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-terciary">
                  Código Postal
                </label>
                <div className="mt-1">
                  <Input
                    {...register("codigo_postal")}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                  {errors.codigo_postal && (
                    <span className="text-opacity-40">
                      {errors.codigo_postal.message}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Metodo Delivery */}
            <div className="mt-10 border-t border-primary-light pt-10">
              <RadioGroup value={delivery} onChange={setDelivery}>
                <h3 className="text-xl font-medium text-terciary">
                  Método de Entrega
                </h3>
                <div className="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
                  {deliveryMetodosList.map((option, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => {
                        deliveryPriceHandler(option.precio);
                      }}
                    >
                      <Radio
                        key={index}
                        value={option}
                        className={({ checked, disabled }) =>
                          classNames(
                            checked ? "border-transparent" : "border-gray-300",
                            disabled ? "ring-2  ring-primary-light" : "",
                            "relative flex cursor-pointer rounded-lg border bg-white p-4 shadow-sm focus:outline-none",
                          )
                        }
                      >
                        {({ checked, disabled }) => (
                          <>
                            <span className="flex flex-1">
                              <span className="flex flex-col">
                                <Label
                                  as="span"
                                  className="block text-base font-medium text-terciary"
                                >
                                  {option.metodo}
                                </Label>
                                <Description
                                  as="span"
                                  className="mt-1 flex items-center text-lg text-terciary"
                                >
                                  ${option.precio}
                                </Description>
                              </span>
                            </span>
                            {checked ? (
                              <CheckCircleIcon className="h-5 w-5 text-terciary-muted" />
                            ) : null}
                            <span
                              className={classNames(
                                disabled ? "border" : "border-2",
                                checked
                                  ? "border-indigo-500"
                                  : "border-transparent",
                                "pointer-events-none absolute -inset-px rounded-lg",
                              )}
                              aria-hidden="true"
                            />
                          </>
                        )}
                      </Radio>
                    </button>
                  ))}
                </div>
              </RadioGroup>
            </div>

            {/* Metodo Delivery */}
            <div className="mt-10 border-t border-primary-light pt-10">
              <h3 className="text-xl font-medium text-terciary">
                Método de Pago
              </h3>
              <fieldset className="mt-4">
                <div className="space-y-4 sm:flex sm:items-center sm:space-x-10 sm:space-y-0">
                  {metodoPagoList.map((option, index) => (
                    <div key={index} className="flex items-center">
                      <Input
                        name="payment-type"
                        type="radio"
                        value={option.metodo}
                        checked={pago == option.metodo}
                        onChange={PagoHandler}
                        className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />

                      <label className="ml-3 block text-sm font-medium text-terciary">
                        {option.titulo}
                      </label>
                    </div>
                  ))}
                </div>
              </fieldset>
            </div>
          </div>
        </div>
        <div className="items-center justify-between text-center "></div>
        <Button type="submit" className="mt-8 text-xl text-center ml-4">
          Procesar Pedido
        </Button>
      </form>
    </>
  );
}
