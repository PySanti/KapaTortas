"use client";

import { useState, useEffect, useRef } from "react";
import { DireccionEntrega } from "@/app/models/Pedido";
import { CheckCircleIcon, HomeIcon, BuildingIcon, ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { UseFormSetValue } from "react-hook-form";
import { DireccionFormData } from "@/app/controladores/lib/validations/direccion-schema";
import { Button } from "../../ui/button";
import { ScrollArea, ScrollBar } from "../../ui/scroll-area";

interface CarouselSelectorProps {
  direcciones: DireccionEntrega[];
  setValue: UseFormSetValue<DireccionFormData>;
  onNewAddressClick: () => void;
}

export function CarouselSelector({ direcciones, setValue, onNewAddressClick }: CarouselSelectorProps) {
  const [selectedAddress, setSelectedAddress] = useState<number | null>(
    direcciones.find((dir) => dir.is_favorite)?.id || (direcciones.length > 0 ? direcciones[0].id : null)
  );

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // Efecto para actualizar el formulario cuando cambia la dirección seleccionada
  useEffect(() => {
    if (selectedAddress) {
      const direccion = direcciones.find((dir) => dir.id === selectedAddress);
      if (direccion) {
        setValue("direccion", direccion.direccion);
        setValue("referencia", direccion.referencia || "");
        setValue("codigo_postal", direccion.codigo_postal);
      }
    }
  }, [selectedAddress, direcciones, setValue]);

  // Efecto para manejar cambios en las direcciones disponibles
  useEffect(() => {
    // Si no hay dirección seleccionada o la seleccionada ya no existe, seleccionar la primera
    if (!selectedAddress || !direcciones.some((dir) => dir.id === selectedAddress)) {
      const newSelectedId =
        direcciones.find((dir) => dir.is_favorite)?.id || (direcciones.length > 0 ? direcciones[0].id : null);
      setSelectedAddress(newSelectedId);
    }
  }, [direcciones, selectedAddress]);

  // Verificar si se puede hacer scroll
  useEffect(() => {
    const checkScroll = () => {
      if (scrollContainerRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
        setCanScrollLeft(scrollLeft > 0);
        setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 5); // 5px de margen
      }
    };

    // Verificar inicialmente
    checkScroll();

    // Agregar listener para verificar durante el scroll
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener("scroll", checkScroll);
      return () => container.removeEventListener("scroll", checkScroll);
    }
  }, [direcciones]);

  const handleAddressSelect = (direccion: DireccionEntrega) => {
    setSelectedAddress(direccion.id);
  };

  // Funciones para navegar el carrusel
  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
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

      <div className="relative">
        {/* Botones de navegación */}
        {direcciones.length > 2 && (
          <>
            <Button
              variant="ghost"
              size="icon"
              className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 rounded-full shadow-md hover:bg-white ${
                !canScrollLeft ? "opacity-50 cursor-not-allowed" : ""
              }`}
              onClick={scrollLeft}
              disabled={!canScrollLeft}
            >
              <ChevronLeftIcon className="h-5 w-5" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 rounded-full shadow-md hover:bg-white ${
                !canScrollRight ? "opacity-50 cursor-not-allowed" : ""
              }`}
              onClick={scrollRight}
              disabled={!canScrollRight}
            >
              <ChevronRightIcon className="h-5 w-5" />
            </Button>
          </>
        )}

        {/* Contenedor con scroll */}
        <div className="overflow-hidden">
          <div
            ref={scrollContainerRef}
            className="flex space-x-4 pb-4 pt-1 px-2 overflow-x-auto"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
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
        </div>
      </div>

      {/* Indicador de cantidad de direcciones */}
      {direcciones.length > 1 && (
        <div className="flex justify-center mt-2 space-x-1">
          {direcciones.map((_, index) => (
            <div
              key={index}
              className={`h-1.5 rounded-full ${
                index === direcciones.findIndex((dir) => dir.id === selectedAddress)
                  ? "w-4 bg-[#00bf8f]"
                  : "w-1.5 bg-gray-300"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
