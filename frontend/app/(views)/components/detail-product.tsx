"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import classNames from "@/app/controladores/utilities/classNames";
import { Presentacion, Producto } from "@/app/models/Producto";
import Gallery from "./gallery";
import Stars from "./stars";
import Selector from "./selector";
import ReviewProduct from "./review-product";
import { RadioGroup, Label, Radio } from "@headlessui/react";
import { Dessert, CheckIcon, CircleX } from "lucide-react";
import { Button } from "./ui/button";

// zustand
import { usePedidoStore } from "@/src/usePedidoStore";

export default function DetailProduct({
  product,
  extraList,
}: {
  product: Producto;
  extraList: Producto[] | undefined;
}) {
  // Zustand
  const setPedidoData = usePedidoStore((state) => state.setPedidoData);
  const router = useRouter();
  // Estados
  const [extras, setExtras] = useState<Producto[]>([]);
  const [present, setPresent] = useState<Presentacion>(
    product.presentaciones?.[0],
  );
  // Calculate rating
  const rating =
    product.reviews?.length > 0
      ? product.reviews.reduce((sum, item) => sum + item.calificacion, 0) /
        product.reviews.length
      : 0;

  // Estrellas
  const stars: number = rating != undefined ? Math.round(rating) : 0;

  const handleHacerPedido = () => {
    setPedidoData({ product, extras, present });
    router.push("/pedido/caja");
  };

  // Calcula el precio total
const totalPrice = useMemo(() => {
  const extrasTotal = extras.reduce((sum, extra) => {
    // Accede al precio en extra.producto.presentaciones[0].precio
    const extraPrice = Number(extra.presentaciones[0]?.precio || 0);
    return sum + extraPrice;
  }, 0);

  return Number(present?.precio || 0) + extrasTotal;
}, [present, extras]);


  return (
    <div className="max-w-2xl mx-4 px-8 py-16 pt-6 sm:px-6 sm:py-24 sm:pt-6 sm:mx-8 lg:grid lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8 xl:max-w-full">
      {/* Detalles del Producto */}
      <div className="lg:max-w-lg lg:self-end">
        <nav>
          <ol role="list" className="flex items-center space-x-2"></ol>
        </nav>

        <div className="mt-4">
          <h1 className="text-4xl lg:text-5xl text-primary">
            {product.titulo}
          </h1>
        </div>

        <section aria-labelledby="informacion" className="mt-4">
          <h2 className="sr-only">Información del Producto</h2>

          {/* Precio y Estrellas */}
          <div className="flex items-center">
            <p className="text-3xl text-terciary tracking-tight">
              ${totalPrice}
            </p>

            <div className="ml-4 border-l border-terciary pl-4">
              <Stars
                rating={stars}
                label={`${product.reviews?.length} reviews`}
              />
            </div>
          </div>

          {/* Descripcion del producto */}

          <div className="mt-4 space-y-6">
            <p className="text-terciary text-base">{product.descripcion}</p>
          </div>

          {/* Verifica si el producto esta en stock */}
          <div className="mt-6 flex items-center">
            {present?.stock && present.stock > 0 ? (
              <>
                <CheckIcon className="h-5 w-5 flex-shrink-0 text-green-500" />
                <p className="ml-2 text-sm text-terciary opacity-80">
                  Disponible
                </p>
              </>
            ) : (
              <>
                <CircleX className="h-5 w-5 flex-shrink-0 text-red-500" />
                <p className="ml-2 text-sm text-terciary opacity-80">
                  No está Disponible
                </p>
              </>
            )}
          </div>

          {/* Calorias del productoe */}
          <div className="mt-6 flex items-center">
            {present?.calorias && (
              <>
                <Dessert className="h-5 w-5 flex-shrink-0 text-primary" />
                <p className="ml-2 text-sm text-terciary opacity-80">
                  {present.calorias} Calorias
                </p>
              </>
            )}
          </div>
        </section>
      </div>

      {/* Galeria */}
      <Gallery product={product} />

      <div className="mt-10 lg:col-start-1 lg:row-start-2 lg:max-w-lg lg:self-start">
        {/* Producto Info */}
        <section className="items-center">
          <form>
            {/* Extras */}
            <Selector
              extraList={extraList}
              selected={extras}
              setSelected={setExtras}
              type="Extras"
            />

            <div className="sm:flex sm:justify-between">
              <RadioGroup value={present} onChange={setPresent}>
                <Label className="block text-lg font-medium p-2">Tamaño</Label>
                <div className="mt-1 grid grid-cols-1 gap-4 items-center sm:grid-cols-2">
                  {product?.presentaciones &&
                    product.presentaciones.map((present, index) => (
                      <Radio
                        as="div"
                        key={index}
                        value={present}
                        className={({ checked }) =>
                          classNames(
                            checked
                              ? "ring-2 ring-primary bg-primary-light bg-opacity-20"
                              : "",
                            "relative block cursor-pointer rounded-lg border border-gray-300 p-4 focus:outline-none",
                          )
                        }
                      >
                        {({ checked, disabled }) => (
                          <>
                            <Label
                              as="p"
                              className="text-base font-medium text-terciary"
                            >
                              {present.proporcion}
                            </Label>
                            <Label
                              as="p"
                              className="mt-1 text-sm text-terciary"
                            >
                              {present.ref}
                            </Label>
                            <div
                              className={classNames(
                                checked ? "border" : "border-2",
                                disabled
                                  ? "border-primary"
                                  : "border-transparent",
                                "pointer-events-none absolute -inset-px rounded-lg",
                              )}
                              aria-hidden="true"
                            />
                          </>
                        )}
                      </Radio>
                    ))}
                </div>
              </RadioGroup>
            </div>

            <div className="mt-10 text-center">
              <Button
                type="button"
                className="text-center text-base py-7 rounded-full"
                onClick={handleHacerPedido}
              >
               Realizar Pedido
              </Button>
            </div>
          </form>
        </section>

        {/* Reviews */}
      </div>
      <ReviewProduct product={product} />
    </div>
  );
}
