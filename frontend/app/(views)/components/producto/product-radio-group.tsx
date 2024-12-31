import { Presentacion } from "@/app/models/Producto";
import { RadioGroup, Radio } from "@headlessui/react";
import { Label } from "@headlessui/react";

import classNames from "@/app/controladores/utilities/classNames";

export default function ProductRadioGroup({
  presentaciones,
  selectedPresent,
  onChange,
}: {
  presentaciones: Presentacion[] | undefined;
  selectedPresent: Presentacion;
  onChange: (value: Presentacion) => void;
}) {
  if (!presentaciones) return null;

  return (
    <RadioGroup value={selectedPresent} onChange={onChange}>
      <Label className="block text-lg font-medium p-2">Tamaño</Label>
      <div className="mt-1 grid grid-cols-1 gap-4 items-center sm:grid-cols-2">
        {presentaciones.map((present, index) => (
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
                <Label as="p" className="text-base font-medium text-terciary">
                  {present.proporcion}
                </Label>
                <Label as="p" className="mt-1 text-sm text-terciary">
                  {present.ref}
                </Label>
                <div
                  className={classNames(
                    checked ? "border" : "border-2",
                    disabled ? "border-primary" : "border-transparent",
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
  );
}
