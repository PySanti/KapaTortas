import Torta from "@/app/(views)/components/images/Torta";
import { MainButton } from "./MainButton";
import Migaja from "@/app/(views)/components/images/Migaja";
import Link from "next/link";
import { Producto } from "@/app/models/Producto";

export default function ItemProducto({ product }: { product: Producto }) {
  return (
    <div className="relative items-start bg-primary-light bg-opacity-70 rounded-full mt-2 lg:mt-10 p-4 md:p-6 lg:p-10 space-x-6 max-w-7xl mx-auto">
      <div className="grid grid-cols-[2fr_3fr] xl:grid-cols-2 items-center">
        <div>
          <Torta
            className="absolute top-[-8vw] md:top-[-6vw] lg:top-[-4vw]"
            path={
              product?.imagenes && product.imagenes.length > 0
                ? product.imagenes[1]
                : "/images/miga-Chocolate.png"
            }
            alt={product.titulo}
          />
        </div>

        <div className="text-center space-y-2">
          <div className="items-center space-x-2">
            <div className="relative sm:flex items-center mx-4 min-w-36 max-w-sm md:max-w-md lg:max-w-lg">
              <h1 className="text-terciary text-3xl text-center md:text-5xl md:text-left lg:text-6xl">
                {product.titulo}
              </h1>
              <Migaja
                className="hidden sm:flex"
                path={
                  product?.imagenes && product.imagenes.length > 0
                    ? product.imagenes[0]
                    : "/images/miga-Chocolate.png"
                }
                alt={product.titulo}
              />
            </div>

            <p className="hidden text-sm text-terciary text-left md:flex lg:text-lg">
              {product.descripcion}
            </p>
            <div className="relative sm:flex items-center p-4 space-x-4">
              <MainButton
                variant="tertiary"
                className="hidden text-sm px-5 py-5 sm:text-lg md:px-6 md:py-6"
              >
                Saber Más
              </MainButton>
              <MainButton className=" text-sm px-5 py-5 sm:text-lg md:px-6 md:py-6">
                <Link href={`/product/${product.producto_id}`}>
                  Realiza tu Pedido
                </Link>
              </MainButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
