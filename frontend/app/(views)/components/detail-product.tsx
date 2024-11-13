"use client";

import { useState } from "react";
import classNames from "@/app/controladores/utilities/classNames";
import { Presentacion, Producto } from "@/app/models/Producto";
import Selector from "./selector";
import { RadioGroup, Label, Radio } from "@headlessui/react";
import { Button } from "./ui/button";

export default function DetailProduct({
  product,
  extraList,
}: {
  product: Producto;
  extraList: Producto[] | undefined;
}) {
  const [extras, setExtras] = useState<Producto[]>([]);
  const [present, setPresent] = useState<Presentacion>(
    product.presentaciones?.[0],
  );

  return (
    <div className="mt-10 lg:col-start-1 lg:row-start-2 lg:max-w-lg lg:self-start">
      {/* Producto Info */}
      <section className="items-center">
        <form>
          {/* Extras */}
          <Selector
            extraList={extraList}
            selected={extras}
            setSelected={setExtras}
            type="Extras"
          />

          <div className="sm:flex sm:justify-between">
            <RadioGroup value={present} onChange={setPresent}>
              <Label className="block text-lg font-medium p-2">Tamaño</Label>
              <div className="mt-1 grid grid-cols-1 gap-4 items-center sm:grid-cols-2">
                {product?.presentaciones &&
                  product.presentaciones.map((present, index) => (
                    <Radio
                      as="div"
                      key={index}
                      value={present}
                      className={({ checked }) =>
                        classNames(
                          checked
                            ? "ring-2 ring-primary bg-primary-light bg-opacity-20"
                            : "",
                          "relative block cursor-pointer rounded-lg border border-gray-300 p-4 focus:outline-none",
                        )
                      }
                    >
                      {({ checked, disabled }) => (
                        <>
                          <Label
                            as="p"
                            className="text-base font-medium text-terciary"
                          >
                            {present.proporcion}
                          </Label>
                          <Label as="p" className="mt-1 text-sm text-terciary">
                            {present.ref}
                          </Label>
                          <div
                            className={classNames(
                              checked ? "border" : "border-2",
                              disabled
                                ? "border-primary"
                                : "border-transparent",
                              "pointer-events-none absolute -inset-px rounded-lg",
                            )}
                            aria-hidden="true"
                          />
                        </>
                      )}
                    </Radio>
                  ))}
              </div>
            </RadioGroup>
          </div>

          <div className="mt-10 text-center">
            <Button
              type="button"
              className="text-center text-base py-7 rounded-full"
            >
              Agregar al Carrito
            </Button>
          </div>
        </form>
      </section>
    </div>
  );
}
