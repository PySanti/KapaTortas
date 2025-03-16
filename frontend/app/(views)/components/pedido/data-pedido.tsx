"use-client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { direccionSchema, DireccionFormData } from "@/app/controladores/lib/validations/direccion-schema";

import { DireccionEntrega, ItemFormat, Pedido, Precios } from "@/app/models/Pedido";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { RadioGroup, Description, Radio } from "@headlessui/react";
import { CheckCircleIcon } from "lucide-react";
import classNames from "@/app/controladores/utilities/classNames";

import { ShippingSelector } from "./data/shipping-selector";
import { PaymentSelector } from "./data/payment-selector";

import { useState, useEffect } from "react";
import { MetodoEntrega, MetodoPago } from "@/app/models/Pedido";

import { usePedidoStore } from "@/src/usePedidoStore";
import getCurrentUser from "@/app/controladores/utilities/get-current-user";
import ClienteAPI from "@/app/controladores/api/cliente-api";
import pedidoApi from "@/app/controladores/api/pedido-api";
import redirectToWhatsapp from "@/app/controladores/utilities/redirect-to-whatsapp";

import { CarouselSelector } from "./data/carousel-selector";
import { DialogAgregarDireccionEnvio } from "@/app/(views)/components/dialog-agregar-direccion-envio";
import { useRouter } from "next/navigation";

// Default values
const deliveryMetodosList = [
  { metodo: "pickup", precio: 0 },
  { metodo: "delivery", precio: 3 },
];

// Dirección por defecto para pickup
const DEFAULT_PICKUP_ADDRESS = {
  direccion: "Tienda Principal",
  referencia: "Retiro en tienda",
  codigo_postal: 1010,
  nota: "",
};

export default function DataPedido({
  direcciones,
  deliveryPriceHandler,
  precios,
}: {
  direcciones: DireccionEntrega[] | null;
  order: ItemFormat[];
  deliveryPriceHandler: (item: number) => void;
  precios: Precios;
}) {
  // Current user
  const session = getCurrentUser();

  // Zustand
  const { cartItems, clearCart, setNota } = usePedidoStore();

  const [delivery, setDelivery] = useState<MetodoEntrega>(MetodoEntrega.PICKUP);
  const [pago, setPago] = useState<MetodoPago>(MetodoPago.PAGO_MOVIL);

  // Direccion Preferida
  const direccionPreferida = direcciones?.find((item) => item.is_favorite);

  // Schema
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    control,
    reset,
  } = useForm<DireccionFormData>({
    resolver: zodResolver(direccionSchema),
    defaultValues:
      delivery === MetodoEntrega.PICKUP
        ? DEFAULT_PICKUP_ADDRESS
        : {
            direccion: direccionPreferida?.direccion || "",
            referencia: direccionPreferida?.referencia || "",
            codigo_postal: direccionPreferida?.codigo_postal || 1000,
            nota: "",
          },
  });

  // Actualizar los valores del formulario cuando cambia el método de entrega
  useEffect(() => {
    if (delivery === MetodoEntrega.PICKUP) {
      reset(DEFAULT_PICKUP_ADDRESS);
    } else if (direccionPreferida) {
      reset({
        direccion: direccionPreferida.direccion,
        referencia: direccionPreferida.referencia || "",
        codigo_postal: direccionPreferida.codigo_postal,
        nota: "",
      });
    }
  }, [delivery, direccionPreferida, reset]);

  const router = useRouter();

  // Estado para controlar el diálogo de nueva dirección
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Función para manejar cuando se agrega una nueva dirección
  const handleNuevaDireccionCreada = () => {
    // Refrescar la página para obtener las direcciones actualizadas
    router.refresh();
    // Cerrar el diálogo
    setIsDialogOpen(false);
  };

  const onSubmit = async (data: DireccionFormData) => {
    console.log("Formulario enviado", data);
    try {
      // Seteo nota rapidito
      setNota(data.nota || "");

      let direccionId: number | null = null;

      // Si es pickup, no necesitamos crear/verificar dirección
      if (delivery === MetodoEntrega.PICKUP) {
        // Usar una dirección predeterminada para pickup o crear una si es necesario
        direccionId = await handlePickupDireccion();
      } else {
        // Verificar si la dirección ya existe
        const checkDireccion = direcciones?.find((direccion) => direccion.direccion === data.direccion);

        // Si no existe, crear una nueva dirección
        if (!checkDireccion) {
          console.log("Nueva dirección creada");
          direccionId = await handleNuevaDireccion(data);
        } else {
          console.log("Dirección existente encontrada");
          direccionId = checkDireccion.id;
        }
      }

      // Si tenemos un ID de dirección, proceder a crear el pedido
      if (direccionId) {
        const pedido = await handleCrearPedido(direccionId, data.nota || "");
        redirectToWhatsapp({
          variant: "pedido",
          pedidoDetails: pedido,
          name: session?.name || "Cliente",
        });
        // No limpiar el carrito hasta que el usuario confirme
        // clearCart();
      } else {
        console.error("No se pudo obtener un ID de dirección.");
      }
    } catch (error) {
      console.error("Error al procesar el formulario:", error);
    }
  };

  // Manejar la dirección para pickup
  const handlePickupDireccion = async (): Promise<number | null> => {
    try {
      // Verificar si ya existe una dirección de pickup
      const direccionesCliente = await ClienteAPI.obtenerDireccionesEnvio(session?.email || "");
      const pickupDireccion = direccionesCliente?.find((dir) => dir.direccion === DEFAULT_PICKUP_ADDRESS.direccion);

      if (pickupDireccion) {
        return pickupDireccion.id;
      }

      // Si no existe, crear una dirección de pickup
      const nuevaDireccionId = await ClienteAPI.crearDireccionCliente(
        session?.email || "",
        DEFAULT_PICKUP_ADDRESS.direccion,
        DEFAULT_PICKUP_ADDRESS.codigo_postal,
        DEFAULT_PICKUP_ADDRESS.referencia
      );

      return nuevaDireccionId;
    } catch (error) {
      console.error("Error al manejar la dirección de pickup:", error);
      return null;
    }
  };

  // Manejar la creación de una nueva dirección
  const handleNuevaDireccion = async (data: DireccionFormData): Promise<number | null> => {
    try {
      const direccionNueva = await ClienteAPI.crearDireccionCliente(
        session?.email || "",
        data.direccion,
        data.codigo_postal,
        data?.referencia
      );

      if (direccionNueva) {
        console.log("Nueva dirección creada:", direccionNueva);
        return direccionNueva;
      } else {
        console.error("Error: La dirección creada no tiene un ID válido.", direccionNueva);
        return null;
      }
    } catch (error) {
      console.error("Error al manejar la creación de una nueva dirección:", error);
      return null;
    }
  };

  // Manejar la creación del pedido
  const handleCrearPedido = async (direccionId: number, nota: string): Promise<Pedido | null> => {
    const cliente = await ClienteAPI.obtenerCliente(session?.email || "");

    if (cliente) {
      const pedido = await pedidoApi.postPedido(
        session?.email || "",
        delivery,
        pago,
        precios.iva,
        precios.total,
        direccionId,
        cartItems,
        nota
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
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
        {/* Metodo Delivery - PRIMERO */}
        <h3 className="text-2xl font-medium text-[#5f5a7f] mb-6">Método de Entrega</h3>
        <RadioGroup
          value={delivery}
          onChange={(value) => {
            setDelivery(value);
            const selectedOption = deliveryMetodosList.find((option) => option.metodo === value);
            if (selectedOption) {
              deliveryPriceHandler(selectedOption.precio);
            }
          }}
        >
          <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
            {deliveryMetodosList.map((option, index) => (
              <Radio
                key={index}
                value={option.metodo}
                className={({ checked, disabled }) =>
                  classNames(
                    checked ? "border-transparent" : "border-gray-300",
                    disabled ? "ring-2 ring-primary-light" : "",
                    "relative flex cursor-pointer rounded-lg border bg-white p-4 shadow-sm focus:outline-none"
                  )
                }
              >
                {({ checked }) => (
                  <>
                    <span className="flex flex-1">
                      <span className="flex flex-col">
                        <Label className="block text-base font-medium text-terciary">
                          {option.metodo === "pickup" ? "Retirar en tienda" : "Entrega a domicilio"}
                        </Label>
                        <Description className="mt-1 flex items-center text-lg text-terciary">
                          ${option.precio}
                        </Description>
                      </span>
                    </span>
                    {checked ? <CheckCircleIcon className="h-5 w-5 text-terciary-muted" /> : null}
                    <span
                      className={classNames(
                        "pointer-events-none absolute -inset-px rounded-lg",
                        checked ? "border-2 border-indigo-500" : "border border-transparent"
                      )}
                      aria-hidden="true"
                    />
                  </>
                )}
              </Radio>
            ))}
          </div>
        </RadioGroup>

        {/* Sección de dirección - SOLO SI ES DELIVERY */}
        {delivery === MetodoEntrega.DELIVERY && (
          <div className="pt-6">
            {/* Mostrar el selector de carrusel solo si hay direcciones disponibles */}
            {direcciones && direcciones.length > 0 && (
              <CarouselSelector
                direcciones={direcciones}
                setValue={setValue}
                onNewAddressClick={() => setIsDialogOpen(true)}
              />
            )}
          </div>
        )}

        <PaymentSelector pago={pago} setPago={setPago} />

        {/* Notas (siempre visible) */}
        {delivery === MetodoEntrega.DELIVERY && (
          <div className="pt-6">
            <Label htmlFor="nota" className="block text-sm font-medium text-terciary">
              Notas adicionales
            </Label>
            <div className="mt-1">
              <Textarea
                {...register("nota")}
                rows={3}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="Instrucciones especiales para la entrega..."
              />
            </div>
          </div>
        )}

        {/* Botón de envío */}
        <div className="flex flex-col items-center pt-6">
          <Button
            type="submit"
            className="mt-8 text-xl text-center ml-4 bg-primary-light hover:bg-primary-dark text-white"
            disabled={
              !session ||
              cartItems.length <= 0 ||
              (delivery === MetodoEntrega.DELIVERY && (!direcciones || direcciones.length === 0))
            }
          >
            Procesar Pedido
          </Button>
          {!session && (
            <span className="text-red-400 text-sm font-medium ml-4 mt-2">
              No puedes realizar un pedido sin una sesión activa
            </span>
          )}
          {Object.keys(errors).length > 0 && (
            <span className="text-red-400 text-sm font-medium ml-4 mt-2">
              Por favor, completa todos los campos requeridos correctamente
            </span>
          )}
          {delivery === MetodoEntrega.DELIVERY && (!direcciones || direcciones.length === 0) && (
            <span className="text-red-400 text-sm font-medium ml-4 mt-2">Debes agregar una dirección de entrega</span>
          )}
        </div>
      </form>
    </section>
  );
}
