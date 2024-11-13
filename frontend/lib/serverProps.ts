import { Producto } from "@/app/models/Producto";
import ProductoAPI from "@/app/controladores/api/ProductoAPI";

export default async function getStaticProps() {
  let productos: Producto[] = [];

  try {
    productos = (await ProductoAPI.obtenerListaProductos()) ?? [];
  } catch (err) {
    console.error("Error cargando los productos: ", err);
  }

  return {
    props: { productos },
    revalidate: 10, // Regenerate the page every 10 seconds
  };
}
