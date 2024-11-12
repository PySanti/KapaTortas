"use client";

import { useState } from "react";
import { Fragment } from "react";

import { Producto } from "@/app/models/Producto";
import Gallery from "./gallery";
import Stars from "./stars";

import { CheckIcon, User } from "lucide-react";
import { IoStar } from "react-icons/io5";
import { RadioGroup, Label, Field, Radio, TabGroup, Tab, TabList, TabPanel, TabPanels } from "@headlessui/react";
import { Button } from "@/app/(views)/components/ui/button";
import { CircleX } from "lucide-react";
import classNames from "@/app/controladores/utilities/classNames";

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

export default function Product({ product, rating }: { product: Producto, rating: number | undefined }) {
  const [size, setSize] = useState<keyof catalogoType>();
  const stars: number = rating != undefined ? Math.round(rating) : 0;

  return (
    <div>
      <div className=" max-w-2xl mx-4 px-8 py-16 pt-6 sm:px-6 sm:py-24 sm:pt-6 sm:mx-8 lg:grid lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8 xl:max-w-full">
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
                ${product.precio}
              </p>

              <div className="ml-4 border-l border-terciary pl-4">

                <Stars rating={ stars } label={ `${product.reviews?.length} reviews` } />                
              </div>
            </div>

            {/* Descripcion del producto */}

            <div className="mt-4 space-y-6">
              <p className="text-terciary text-base">
                {product.descripcion.caracteristicas}
              </p>
            </div>

            {/* Verifica si el producto esta en stock */}
            <div className="mt-6 flex items-center">
              { product.stock > 0  ?  
              <>
                <CheckIcon className="h-5 w-5 flex-shrink-0 text-green-500" />
                <p className="ml-2 text-sm text-terciary opacity-80">
                  Disponible
                </p>
              </>
              : 
              <>
              <CircleX className="h-5 w-5 flex-shrink-0 text-red-500" /> 
                <p className="ml-2 text-sm text-terciary opacity-80">
                No está Disponible
                </p> 
              </>
              }
            </div>
          </section>
        </div>

         {/* Galeria */}
         <Gallery product={ product } />


        {/* Producto Info */}
        <div className="mt-10 lg:col-start-1 lg:row-start-2 lg:max-w-lg lg:self-start">
          <section className="items-center">
            <form>
              <div className="sm:flex sm:justify-between">
                <RadioGroup value={size} onChange={setSize}>
                  <Label className="block text-sm font-medium">
                    Size
                  </Label>
                  <div className="mt-1 grid grid-cols-1 gap-4 items-center sm:grid-cols-2">
                    {product.proporcion.map((size, index) => (
                      <Radio
                        as="div"
                        key={index}
                        value={size}
                        className={({ checked }) =>
                          classNames(
                            checked ? "ring-2 ring-indigo-500" : "",
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
                              {size}
                            </Label>
                            <Label
                              as="p"
                              className="mt-1 text-sm text-terciary"
                            >
                              {catalogoDefault[size as keyof catalogoType]}
                            </Label>
                            <div
                              className={classNames(
                                checked ? "border" : "border-2",
                                disabled
                                  ? "border-indigo-500"
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
                >
                  Agregar al Carrito
                </Button>
              </div>
            </form>
          </section>
        </div>


        {/* Reviews */}

        <div className="mx-auto mt-16 w-full max-w-2xl lg:col-span-4 lg:mt-0 lg:max-w-none">
              <TabGroup as="div">
                <div className="border-b border-secondary-light" >
                  <TabList className="-mb-px flex space-x-8">
                    <Tab
                      className={({ selected }) => 
                        classNames(
                          selected 
                          ? " border-primary-light text-primary-light"
                          : "border-transparent text-terciary hover:border-primary-light hover:text-terciary",
                          "whitespace-nowrap border-b-2 py-6 text-sm font-medium"
                        )
                      }
                    >
                      Reviews
                    </Tab>
                    
                  </TabList>
                </div>


                  {/* Reviews completas */}
                <TabPanels as={Fragment}>
                  <TabPanel className="-mb-10">
                    <h3 className="sr-only">Reviews</h3>
                      {product.reviews?.map((item, index) => (
                        <div key={index} className="flex space-x-4 text-base text-terciary">
                          {/* Icon */}
                          <div className="flex-none py-10">
                            <User className="text-terciary text-lg" />
                          </div>

                          <div className={classNames(index === 0 ? "" : 'border-t border-primary-light', 'py-10')}>
                            <h3 className="font-medium text-terciary">{item.cliente.perfil.nombre_completo}</h3>
                            <Stars rating={ item.puntuacion } label="Puntuación" />
                            
                            <div
                                 className="prose prose-sm mt-4 max-w-none text-gray-500"
                              dangerouslySetInnerHTML={{ __html: item.review }}
                            />

                          </div>

                        </div>
                      ))}
                  </TabPanel>
                </TabPanels>

              </TabGroup>
        </div>
      </div>
    </div>
  );
}
