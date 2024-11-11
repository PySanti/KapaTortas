"use client";

import { useState } from "react";

import { Producto } from "@/app/models/Producto";
import ProductImage from "@/components/images/ProductImage";
import { CheckIcon } from "lucide-react";
import { RadioGroup } from "@headlessui/react";
import { Button } from "@/components/ui/button";

// Funcion para agilizar la puesta de todos los classNames
function classNames(...classes: (string | undefined | false)[]): string {
  return classes.filter(Boolean).join(" ");
}

// La descripción de los productos
type catalogoType = {
  pequeña: string;
  mediana: string;
  grande: string;
};

const catalogoDefault: catalogoType = {
  pequeña: "Perfecto para un pequeño snack.",
  mediana: "Perfecto para compartir con tu pareja.",
  grande: "Para compartir con la familia.",
};

export default function Product({ product }: { product: Producto }) {
  const [size, setSize] = useState<keyof catalogoType>();

  return (
    <div className="">
      <div className=" max-w-2xl mx-4 px-8 py-16 pt-6 sm:px-6 sm:py-24 sm:pt-6 sm:mx-8 lg:grid lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8">
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
            <p className="text-3xl text-terciary tracking-tight">
              ${product.precio}
            </p>

            <div className="mt-4 space-y-6">
              <p className="text-terciary text-base">
                {product.descripcion.caracteristicas}
              </p>
            </div>

            <div className="mt-6 flex items-center">
              <CheckIcon className="h-5 w-5 flex-shrink-0 text-green-500" />
              <p className="ml-2 text-sm text-terciary opacity-80">
                Disponible
              </p>
            </div>
          </section>
        </div>

        {/* Imagen */}
        <div className="mt-10 lg:col-start-2 lg:row-span-2 lg:mt-0 lg:self-center">
          <div className="aspect-h-1 aspect-w-1 overflow-hidden rounded-lg">
            {/* <Image */}
            <ProductImage
              path={
                product.imagenes && product.imagenes.length > 0
                  ? product.imagenes[0]
                  : "/images/Torta-Chocolate.png"
              }
              alt={product.titulo}
            />
          </div>
        </div>

        {/* Producto Info */}
        <div className="mt-10 lg:col-start-1 lg:row-start-2 lg:max-w-lg lg:self-start">
          <section className="items-center">
            <form>
              <div className="sm:flex sm:justify-between">
                <RadioGroup value={size} onChange={setSize}>
                  <RadioGroup.Label className="block text-sm font-medium">
                    Size
                  </RadioGroup.Label>
                  <div className="mt-1 grid grid-cols-1 gap-4 items-center sm:grid-cols-2">
                    {product.proporcion.map((size, index) => (
                      <RadioGroup.Option
                        as="div"
                        key={index}
                        value={size}
                        className={({ active }) =>
                          classNames(
                            active ? "ring-2 ring-indigo-500" : "",
                            "relative block cursor-pointer rounded-lg border border-gray-300 p-4 focus:outline-none",
                          )
                        }
                      >
                        {({ active, checked }) => (
                          <>
                            <RadioGroup.Label
                              as="p"
                              className="text-base font-medium text-terciary"
                            >
                              {size}
                            </RadioGroup.Label>
                            <RadioGroup.Description
                              as="p"
                              className="mt-1 text-sm text-terciary"
                            >
                              {catalogoDefault[size as keyof catalogoType]}
                            </RadioGroup.Description>
                            <div
                              className={classNames(
                                active ? "border" : "border-2",
                                checked
                                  ? "border-indigo-500"
                                  : "border-transparent",
                                "pointer-events-none absolute -inset-px rounded-lg",
                              )}
                              aria-hidden="true"
                            />
                          </>
                        )}
                      </RadioGroup.Option>
                    ))}
                  </div>
                </RadioGroup>
              </div>
              <div className="mt-10 text-center">
                <Button
                  type="button"
                  className="text-center text-base py-7 rounded-full"
                >
                  Agregar al Carrito
                </Button>
              </div>
            </form>
          </section>
        </div>
      </div>
    </div>
  );
}
