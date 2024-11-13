import HomePage from "../(views)/components/home-page";
import ProductoAPI from "../controladores/api/ProductoAPI";
import { Producto } from "../models/Producto";
import getStaticProps from "@/lib/serverProps";
import { ClientePC } from "../models/config/marketing";

export default async function Home() {
// EN PC NO TENGO EL SERVER AAA

  // const product = (await getStaticProps()).props.productos;

  // if (!Array.isArray(product)) {
  //   console.error("Expected productoList to be an array, received:", product);
  //   return <p>Hola</p>;
  // }

  const product = ClientePC;

  return (
    <>
      <HomePage productos={product} />
    </>
  );
}
