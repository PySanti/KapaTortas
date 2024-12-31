import Product from "../../components/producto/product";

export default async function ProductPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;

  return (
    <div>
      <Product id={id} />
    </div>
  );
}
