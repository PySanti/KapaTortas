import HomePage from "../(views)/components/home/home-page";

import getStaticProps from "@/lib/serverProps";
import searchPagoMovil from "@/lib/imap-flow";

export default async function Home() {
  // Check pagos
  const pagos = await searchPagoMovil(526563);
  console.log("Aqui esta el pago:", pagos);
  //* Refactorizar esto, usar productoApi
  const product = (await getStaticProps()).props.productos;

  if (!Array.isArray(product)) {
    console.error("Expected productoList to be an array, received:", product);
    return <p>Hola</p>;
  }

  return (
    <>
      <HomePage productos={product} />
    </>
  );
}
