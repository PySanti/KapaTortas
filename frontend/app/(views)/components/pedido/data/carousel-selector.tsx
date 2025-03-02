"use client";

import { useState } from "react";
import { DireccionEntrega } from "@/app/models/Pedido";
import { CheckCircleIcon, HomeIcon, BuildingIcon } from "lucide-react";
import { UseFormSetValue } from "react-hook-form";
import { DireccionFormData } from "@/app/controladores/lib/validations/direccion-schema";
import { Button } from "../../ui/button";
import { ScrollArea } from "../../ui/scroll-area";

interface CarouselSelectorProps {
  direcciones: DireccionEntrega[];
  setValue: UseFormSetValue<DireccionFormData>;
  onNewAddressClick: () => void;
}

export function CarouselSelector({ direcciones, setValue, onNewAddressClick }: CarouselSelectorProps) {
  const [selectedAddress, setSelectedAddress] = useState<number | null>(
    direcciones.find((dir) => dir.is_favorite)?.id || null
  );

  const handleAddressSelect = (direccion: DireccionEntrega) => {
    setSelectedAddress(direccion.id);

    // Actualizar el formulario con la dirección seleccionada
    setValue("direccion", direccion.direccion);
    setValue("referencia", direccion.referencia || "");
    setValue("codigo_postal", direccion.codigo_postal);
  };

  // Determinar el tipo de icono basado en el nombre de la dirección
  const getAddressIcon = (nombre: string) => {
    const lowerNombre = nombre.toLowerCase();
    if (lowerNombre.includes("casa") || lowerNombre.includes("hogar")) {
      return <HomeIcon className="h-8 w-8" />;
    } else {
      return <BuildingIcon className="h-8 w-8" />;
    }
  };

  return (
    <div className="w-full mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-medium text-[#5f5a7f]">Dirección de entrega</h2>
        <Button variant="link" onClick={onNewAddressClick} className="text-[#8a84a8] hover:text-[#5f5a7f]">
          Nueva dirección
        </Button>
      </div>

      <ScrollArea className="w-full">
        <div className="flex space-x-4 pb-4 pt-1">
          {direcciones.map((direccion) => (
            <div
              key={direccion.id}
              onClick={() => handleAddressSelect(direccion)}
              className={`
                relative flex-none w-72 cursor-pointer rounded-xl border-2 p-4
                ${
                  selectedAddress === direccion.id
                    ? "border-[#00bf8f] bg-white"
                    : "border-gray-200 bg-gray-50 hover:border-gray-300"
                }
                transition-all duration-200
              `}
            >
              <div className="flex items-start">
                <div
                  className={`
                  flex-none rounded-full p-3 mr-4
                  ${selectedAddress === direccion.id ? "bg-[#00bf8f]/10 text-[#00bf8f]" : "bg-gray-100 text-gray-500"}
                `}
                >
                  {getAddressIcon(direccion.direccion)}
                </div>

                <div className="flex-1">
                  <h3 className="font-medium text-lg text-[#5f5a7f]">
                    {direccion.direccion.length > 20
                      ? direccion.direccion.substring(0, 20) + "..."
                      : direccion.direccion}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {direccion.referencia && direccion.referencia.length > 30
                      ? direccion.referencia.substring(0, 30) + "..."
                      : direccion.referencia || "Sin referencia"}
                  </p>
                </div>
              </div>

              {selectedAddress === direccion.id && (
                <CheckCircleIcon className="absolute top-3 right-3 h-6 w-6 text-[#00bf8f]" />
              )}
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
