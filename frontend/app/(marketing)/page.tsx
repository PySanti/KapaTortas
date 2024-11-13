import HomePage from "../(views)/components/home-page";
import ProductoAPI from "../controladores/api/ProductoAPI";
import { Producto } from "../models/Producto";

export default async function Home({}) {
  let productos: Producto[] = [];

  try {
    productos = (await ProductoAPI.obtenerListaProductos()) ?? [];
  } catch (err) {
    console.error("Error cargando los productos: ", err);
  }

  return (
    <>
      <HomePage productos={productos} />
    </>
  );
}
