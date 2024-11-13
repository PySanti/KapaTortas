import { Producto, Categoria } from "@/app/models/Producto";
import ProductoAPI from "@/app/controladores/api/ProductoAPI";
import DetailProduct from "./detail-product";

import Gallery from "./gallery";
import Stars from "./stars";
import ReviewProduct from "./review-product";

import { CheckIcon, Dessert } from "lucide-react";
import { CircleX } from "lucide-react";

export const dynamic = "force-dynamic";

async function fetchProduct(id: string): Promise<Producto | null> {
  try {
    return await ProductoAPI.obtenerProducto(Number(id));
  } catch (error) {
    console.error("Error Buscando producto:", error);
    return null;
  }
}

async function fetchExtras(): Promise<Producto[] | undefined> {
  try {
    const products = await ProductoAPI.obtenerListaProductos();
    return products?.filter((item) => item.categoria === Categoria.EXTRA);
  } catch (error) {
    console.error("Error buscando extras:", error);
    return [];
  }
}

export default async function Product({ id }: { id: string }) {
  const product = await fetchProduct(id);
  const extraList = await fetchExtras();

  if (!product) {
    return (
      <div className="text-center text-red-500">Producto no encontrado</div>
    );
  }

  // Calculate rating
  const rating =
    product.reviews?.length > 0
      ? product.reviews.reduce((sum, item) => sum + item.calificacion, 0) /
        product.reviews.length
      : 0;

  // Default selected presentation
  const present = product.presentaciones?.[0];
  // Estrellas
  const stars: number = rating != undefined ? Math.round(rating) : 0;

  return (
    <div className="py-2 md:py-10 space-y-4 ">
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

        {/* as */}
        <DetailProduct product={product} extraList={extraList} />

        {/* Reviews */}

        <ReviewProduct product={product} />
      </div>
    </div>
  );
}
