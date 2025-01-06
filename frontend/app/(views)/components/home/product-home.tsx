import { Categoria, Producto } from "@/app/models/Producto";
import ItemProducto from "../item-producto";

export default function ProductHome({
  sectionCatalogoRef,
  productos,
}: {
  sectionCatalogoRef: React.RefObject<HTMLDivElement>;
  productos: Producto[];
}) {
  return (
    <section ref={sectionCatalogoRef} className="w-full mb-20">
      <div className="relative ">
        <div className="m-4 md:m-2 p-6 md:p-8 lg:p-10">
          <h1 className="text-primary text-4xl lg:text-6xl">Nuestras Tortas</h1>
          {/* <span>-----</span> */}
        </div>
        <div className="container mx-auto px-4">
          <div className="flex flex-col gap-16">
            {productos
              .filter((item) => item.categoria === Categoria.POSTRE)
              .map((product, index) => {
                return (
                  <div key={index} className="w-full">
                    <ItemProducto key={index} product={product} />
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </section>
  );
}
