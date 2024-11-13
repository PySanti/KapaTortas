"use client";

import { Producto } from "@/app/models/Producto";
import classNames from "@/app/controladores/utilities/classNames";

export default function Selector({
  extraList,
  selected,
  setSelected,
  type,
}: {
  extraList: Producto[] | undefined;
  selected: Producto[];
  setSelected: React.Dispatch<React.SetStateAction<Producto[]>>;
  type: string;
}) {
  const handleSizeChange = (size: Producto) => {
    setSelected((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size],
    );
  };

  return (
    <div className="sm:justify-between">
      <h3 className="sr-only">Calorias</h3>

      <label className="block text-lg font-medium p-2">{type}</label>
      <div className="mt-1 grid grid-cols-1 gap-4 items-center sm:grid-cols-2">
        {extraList?.map((product, index) => (
          <div
            key={index}
            className={classNames(
              selected?.includes(product)
                ? "ring-2 ring-primary bg-primary-light bg-opacity-20"
                : "",
              "relative block cursor-pointer rounded-lg border border-gray-300 p-4 focus:outline-none",
            )}
            onClick={() => handleSizeChange(product)}
          >
            {product?.presentaciones && product.presentaciones.length > 0 ? (
              <label className="text-base font-medium text-terciary">
                ${product.presentaciones[0].precio}
              </label>
            ) : (
              ""
            )}

            <p className="mt-1 text-sm text-terciary">{product.descripcion}</p>
            <div
              className={classNames(
                selected?.includes(product) ? "border" : "border-2",
                "pointer-events-none absolute -inset-px rounded-lg",
              )}
              aria-hidden="true"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
