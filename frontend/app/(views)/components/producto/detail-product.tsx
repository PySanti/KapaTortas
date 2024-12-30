"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { Presentacion, Producto } from "@/app/models/Producto";
import Gallery from "../gallery";
import Stars from "../stars";
import Selector from "../selector";
import ReviewProduct from "./review-product";
import { Button } from "../ui/button";

// zustand
import { usePedidoStore } from "@/src/usePedidoStore";
import StockStatus from "./stock-status";
import ProductRadioGroup from "./product-radio-group";

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
  const rating = useMemo(() => {
    return product.reviews?.length
      ? product.reviews.reduce((sum, item) => sum + item.calificacion, 0) /
          product.reviews.length
      : 0;
  }, [product.reviews]);

  const stars = Math.round(rating || 0);

  // Calcula el precio total
  const totalPrice = useMemo(() => {
    const extrasTotal = extras.reduce((sum, extra) => {
      // Accede al precio en extra.producto.presentaciones[0].precio
      const extraPrice = Number(extra.presentaciones[0]?.precio || 0);
      return sum + extraPrice;
    }, 0);

    return Number(present?.precio || 0) + extrasTotal;
  }, [present, extras]);

  const handleHacerPedido = () => {
    setPedidoData({ product, extras, present });
    router.push("/pedido/caja");
  };

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

          {/* Verifica si el producto esta en stock */}
          <StockStatus stock={present?.stock} />

          {/* Descripcion del producto */}

          <div className="mt-4 space-y-6">
            <p className="text-terciary text-base">{product.descripcion}</p>
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
              <ProductRadioGroup
                presentaciones={product?.presentaciones}
                selectedPresent={present}
                onChange={setPresent}
              />
            </div>

            <div className="flex flex-col w-auto space sm:flex-row justify-evenly mt-10 text-center">
              <Button
                type="button"
                variant="secondary"
                className="m-4 mt-0 sm:m-auto text-center text-base py-7 w-auto rounded-full border-2 border-primary"
                onClick={handleHacerPedido}
              >
                Añadir al Carrito
              </Button>
              <Button
                type="button"
                className="m-4 mt-0 sm:m-auto text-center text-base py-7 rounded-full"
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
