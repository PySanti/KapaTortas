"use-client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  direccionSchema,
  DireccionFormData,
} from "@/app/controladores/lib/validations/direccion-schema";

import { DireccionEntrega, ItemFormat, Pedido } from "@/app/models/Pedido";
import { Button } from "../ui/button";
import { RadioGroup, Label, Description, Radio } from "@headlessui/react";
import { CheckCircleIcon } from "lucide-react";
import classNames from "@/app/controladores/utilities/classNames";

import { ShippingSelector } from "./data/shipping-selector";
import { PaymentSelector } from "./data/payment-selector";

import { useState } from "react";
import { MetodoEntrega, MetodoPago } from "@/app/models/Pedido";

import { usePedidoStore } from "@/src/usePedidoStore";
import getCurrentUser from "@/app/controladores/utilities/get-current-user";
import ClienteAPI from "@/app/controladores/api/cliente-api";
import pedidoApi from "@/app/controladores/api/pedido-api";
import redirectToWhatsapp from "@/app/controladores/utilities/redirect-to-whatsapp";

// Default values
const deliveryMetodosList = [
  { metodo: "delivery", precio: 3 },
  { metodo: "pickup", precio: 0 },
];

export default function DataPedido({
  direcciones,
  order,
  deliveryPriceHandler,
  total,
}: {
  direcciones: DireccionEntrega[] | null;
  order: ItemFormat[];
  deliveryPriceHandler: (item: number) => void;
  total: number;
}) {
  // Current user
  const session = getCurrentUser();
  console.log(session);

  // Zustand
  const { cartItems, clearCart } = usePedidoStore();

  const [delivery, setDelivery] = useState<MetodoEntrega>(
    MetodoEntrega.DELIVERY,
  );
  const [pago, setPago] = useState<MetodoPago>(MetodoPago.PAGO_MOVIL);

  // Direccion Preferida
  const direccionPreferida = direcciones?.find((item) => item.is_favorite);

  const defaultValues: {
    direccion: string;
    referencia?: string;
    codigo_postal: string;
  } = {
    direccion: direccionPreferida?.direccion || "",
    referencia: direccionPreferida?.referencia || "",
    codigo_postal: direccionPreferida?.codigo_postal
      ? direccionPreferida.codigo_postal.toString()
      : "1000",
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

  const onSubmit = async (data: DireccionFormData) => {
    try {
      // Verificar si la dirección ya existe
      const checkDireccion = direcciones?.find(
        (direccion) => direccion.direccion === data.direccion,
      );

      let direccionId: number | null = null;

      // Si no existe, crear una nueva dirección
      if (!checkDireccion) {
        direccionId = await handleNuevaDireccion(data);
      } else {
        direccionId = checkDireccion.id;
      }

      // Si tenemos un ID de dirección, proceder a crear el pedido
      if (direccionId) {
        const pedido = await handleCrearPedido(direccionId);
        redirectToWhatsapp({
          pedidoDetails: pedido,
          name: session?.name || "Cliente",
        });
        clearCart();
      } else {
        console.error("No se pudo obtener un ID de dirección.");
      }
    } catch (error) {
      console.error("Error al procesar el formulario:", error);
    }
  };

  // Manejar la creación de una nueva dirección
  const handleNuevaDireccion = async (
    data: DireccionFormData,
  ): Promise<number | null> => {
    try {
      const direccionNueva = await ClienteAPI.crearDireccionCliente(
        session?.email || "",
        data.direccion,
        data.codigo_postal,
        data?.referencia,
      );

      if (direccionNueva) {
        console.log("Nueva dirección creada:", direccionNueva);
        return direccionNueva;
      } else {
        console.error(
          "Error: La dirección creada no tiene un ID válido.",
          direccionNueva,
        );
        return null;
      }
    } catch (error) {
      console.error(
        "Error al manejar la creación de una nueva dirección:",
        error,
      );
      return null;
    }
  };

  // Manejar la creación del pedido
  const handleCrearPedido = async (
    direccionId: number,
  ): Promise<Pedido | null> => {
    const cliente = await ClienteAPI.obtenerCliente(session?.email || "");

    if (cliente) {
      const pedido = await pedidoApi.postPedido(
        session?.email || "",
        delivery,
        pago,
        total,
        direccionId,
        cartItems,
      );
      console.log("Pedido creado con éxito.");
      return pedido;
    } else {
      console.error("Error al obtener el cliente.");
      return null;
    }
  };

  return (
    <section className="py-16 px-8">
      <form onSubmit={handleSubmit(onSubmit)}>
        <ShippingSelector register={register} errors={errors} />

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
                    value={option.metodo}
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

        <PaymentSelector pago={pago} setPago={setPago} />
        <div className="flex flex-col items-center">
          {" "}
          <Button
            type="submit"
            className="mt-8 text-xl text-center ml-4"
            disabled={!session || cartItems.length <= 0}
          >
            Procesar Pedido
          </Button>
          {!session && (
            <span className="text-red-400 text-sm font-medium ml-4 mt-2">
              No puedes realizar un pedido sin una sesión activa
            </span>
          )}
        </div>
      </form>
    </section>
  );
}
