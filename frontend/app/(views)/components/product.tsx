"use client";

import { useState, useEffect } from "react";
import { Fragment } from "react";

import { Producto, Presentacion, Categoria } from "@/app/models/Producto";
import ProductoAPI from "@/app/controladores/api/ProductoAPI";

import Gallery from "./gallery";
import Stars from "./stars";
import Selector from "./selector";

import { CheckIcon, User, Dessert } from "lucide-react";
import { RadioGroup, Label, Field, Radio, TabGroup, Tab, TabList, TabPanel, TabPanels } from "@headlessui/react";
import { Button } from "@/app/(views)/components/ui/button";
import { CircleX } from "lucide-react";
import classNames from "@/app/controladores/utilities/classNames";


export default function Product({ id }: { id: string }) {
  const [product, setProduct] = useState<Producto | null>(null);
  const [rating, setRating] = useState<number | undefined>(undefined);

    // Extras Lista completa
    const [extraList, setExtraList] = useState<Producto[]>([]);
    // Extras seleccionados
    const [extras, setExtras] = useState<Producto[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch Data del producto
        const productData = await ProductoAPI.obtenerProducto(Number(id));
        if (productData) {
          setProduct(productData);

          // Calcula el rating de las reviews
          if (productData.reviews && productData.reviews.length > 0) {
            const avgRating = productData.reviews.reduce((sum, item) => sum + item.puntuacion, 0) / productData.reviews.length;
            setRating(avgRating);
          }
        } else {
          setProduct(null);
        }

        // Obtener la lista de productos
        const extrasData = await ProductoAPI.obtenerListaProductos();
        if (extrasData) {
          setExtraList(extrasData.filter((item) => item.categoria === Categoria.EXTRA));
        }
      } catch (error) {
        console.error("Error fetching product or extras:", error);
      }
    };

    fetchData();
     }, [id]);

  if (!product) {
      return <div>Product not found</div>;
  }


  // Proporcion seleccionada
  const [present, setPresent] = useState<Presentacion | undefined>(product.presentacion?.[0]);
  // Estrellas
  const stars: number = rating != undefined ? Math.round(rating) : 0;

  return (
    <div className='py-2 md:py-10 space-y-4 '>
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
                ${present?.precio}
              </p>

              <div className="ml-4 border-l border-terciary pl-4">

                <Stars rating={ stars } label={ `${product.reviews?.length} reviews` } />                
              </div>
            </div>

            {/* Descripcion del producto */}

            <div className="mt-4 space-y-6">
              <p className="text-terciary text-base">
                {product.descripcion}
              </p>
            </div>
                        

            {/* Verifica si el producto esta en stock */}
            <div className="mt-6 flex items-center">
              { present?.stock && present.stock > 0  ?  
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

            
        {/* Calorias del productoe */}
        <div className="mt-6 flex items-center">
          { present?.calorias && <>
            <Dessert className="h-5 w-5 flex-shrink-0 text-primary" />
            <p className="ml-2 text-sm text-terciary opacity-80">
                  { present.calorias } Calorias
                </p>
          </> }
        </div>
       

          </section>
        </div>
      

         {/* Galeria */}
         <Gallery product={ product } />


        {/* Producto Info */}
        <div className="mt-10 lg:col-start-1 lg:row-start-2 lg:max-w-lg lg:self-start">
          <section className="items-center">
            <form>
             {/* Extras */}
              <Selector extraList={ extraList } selected={ extras } setSelected={ setExtras } type="Extras" />

              <div className="sm:flex sm:justify-between">
                <RadioGroup value={present} onChange={setPresent}>
                  <Label className="block text-lg font-medium p-2">
                    Tamaño
                  </Label>
                  <div className="mt-1 grid grid-cols-1 gap-4 items-center sm:grid-cols-2">
                    {product?.presentacion && product.presentacion.map((present, index) => (
                      <Radio
                        as="div"
                        key={index}
                        value={present}
                        className={({ checked }) =>
                          classNames(
                            checked ? "ring-2 ring-primary bg-primary-light bg-opacity-20" : "",
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
                              { present.proporcion }
                            </Label>
                            <Label
                              as="p"
                              className="mt-1 text-sm text-terciary"
                            >
                              { present.ref }
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
