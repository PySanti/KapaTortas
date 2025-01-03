import HomePage from '../(views)/components/home-page';
import ProductoAPI from '../controladores/api/ProductoAPI';
import { Producto } from '../models/Producto';
import getStaticProps from '@/lib/serverProps';

export default async function Home() {
  //* Refactorizar esto, usar productoApi
  const product = (await getStaticProps()).props.productos;

  if (!Array.isArray(product)) {
    console.error('Expected productoList to be an array, received:', product);
    return <p>Hola</p>;
  }

  return (
    <>
      <HomePage productos={product} />
    </>
  );
}
