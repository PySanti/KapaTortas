import { Producto, Categoria } from "@/app/models/Producto";
import ProductoAPI from "@/app/controladores/api/ProductoAPI";
import DetailProduct from "./detail-product";

import ReviewProduct from "./review-product";

export const dynamic = "force-dynamic";

async function fetchProduct(id: string): Promise<Producto | null> {
  try {
    return await ProductoAPI.obtenerProducto(Number(id));
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
}

async function fetchExtras(): Promise<Producto[] | undefined> {
  try {
    const products = await ProductoAPI.obtenerListaProductos();
    return products?.filter((item) => item.categoria === Categoria.EXTRA);
  } catch (error) {
    console.error("Error fetching extras:", error);
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
  // // Default selected presentation
  // const present = product.presentaciones?.[0];

  return (
    <div className="py-2 md:py-10 space-y-4 ">
      <DetailProduct product={product} extraList={extraList} />
    </div>
  );
}
