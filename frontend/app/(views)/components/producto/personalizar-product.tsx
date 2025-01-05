"use client";

import { Suspense, useState } from "react";
import { useRouter } from "next/navigation";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { motion } from "framer-motion";
import { Capa, sabores } from "@/app/models/capas";
import TortaModel from "./torta-model";
import { usePedidoStore } from "@/src/usePedidoStore";
import { Producto } from "@/app/models/Producto";
import { CircleX } from "lucide-react";

export default function PersonalizarProduct({
  product,
}: {
  product: Producto;
}) {
  const router = useRouter();
  // zustand
  const { addToCart, checkSameItem } = usePedidoStore();
  const [capas, setCapas] = useState<Capa[]>([]);
  const [selectedSabor, setSelectedSabor] = useState(sabores[0]);

  const present = product?.presentaciones[0];

  const tortaId = () => {
    return capas.map((capa) => capa.sabor).join(" + ");
  };

  const handleCart = (type: string) => {
    if (capas.length >= 3) {
      const id = tortaId();
      console.log(id);
      if (
        !(
          type === "realizar" &&
          checkSameItem({ id, product, present, quantity: 1 })
        )
      ) {
        addToCart({ id, product, present, quantity: 1 });
      }
    }
    if (type === "realizar") {
      router.push("/pedido/caja");
    }
  };

  const addCapa = () => {
    if (capas.length < 3) {
      setCapas([
        ...capas,
        {
          id: `capa-${capas.length}`,
          sabor: selectedSabor.name,
          color: selectedSabor.color,
        },
      ]);
    }
  };

  const removeCapa = () => {
    setCapas(capas.slice(0, -1));
  };

  return (
    <div className="min-h-screen grid gap-8 lg:grid-cols-2 p-4 sm:p-6 lg:p-12">
      {/* Information and Controls */}
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary mb-2">
            Crea tu Torta
          </h1>
          <p className="text-sm sm:text-base text-terciary">
            Selecciona los sabores para crear tu torta preferida, capa por capa
          </p>
        </div>

        <div className="space-y-4 sm:space-y-6">
          <div>
            <h1 className="text-terciary mb-4">
              Precio: ${product?.presentaciones[0].precio}
            </h1>
            <Label className="text-base sm:text-lg mb-2 sm:mb-4">
              Selecciona el sabor (3 sabores)
            </Label>
            <RadioGroup
              defaultValue={sabores[0].id}
              onValueChange={(value: string) => {
                setSelectedSabor(
                  sabores.find((f) => f.id === value) || sabores[0],
                );
              }}
              className="grid grid-cols-2 sm:grid-cols-3 gap-4"
            >
              {sabores.map((sabor) => (
                <Label
                  key={sabor.id}
                  className="flex items-center space-x-3 border rounded-lg p-4 cursor-pointer hover:bg-secondary [&:has(:checked)]:bg-secondary"
                >
                  <RadioGroupItem value={sabor.id} id={sabor.id} />
                  <span className="text-sm sm:text-base">{sabor.name}</span>
                  <div
                    className="ml-auto w-6 h-6 rounded-full border"
                    style={{ backgroundColor: sabor.color }}
                  />
                </Label>
              ))}
            </RadioGroup>
          </div>

          {/* Botones de las Capas */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              onClick={addCapa}
              disabled={capas.length >= 3}
              className="flex-1"
            >
              Agrega la Capa
            </Button>
            <Button
              onClick={removeCapa}
              variant="outline"
              disabled={capas.length === 0}
              className="flex-1"
            >
              Quita la Capa
            </Button>
          </div>

          <div className="space-y-2">
            <Label>Capas Agregadas:</Label>
            <div className="space-y-2">
              {capas.length === 0 ? (
                <p className="text-sm sm:text-base text-muted">
                  No hay capas agregadas aún
                </p>
              ) : (
                capas.map((capa, index) => (
                  <motion.div
                    key={capa.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-2 p-2 border rounded"
                  >
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: capa.color }}
                    />
                    <span className="text-sm sm:text-base">
                      Capa {index + 1}: {capa.sabor}
                    </span>
                  </motion.div>
                ))
              )}
            </div>
          </div>

          {/* Botones realizar */}

          <div className="flex flex-col mt-10 text-center">
            <div className="flex flex-col w-auto space sm:flex-row justify-evenly">
              <Button
                type="button"
                variant="secondary"
                className={` m-4 mt-0 sm:m-auto text-center text-base py-7 w-auto rounded-full border-2 border-primary transition-transform duration-200 active:scale-90`}
                onClick={() => handleCart("carrito")}
                disabled={capas.length < 3}
              >
                Añadir al Carrito
              </Button>
              <Button
                type="button"
                className={`${(!present?.stock || present.stock < 1) && "hidden"} m-4 mt-0 sm:m-auto text-center text-base py-7 rounded-full transition-transform duration-200 active:scale-90`}
                onClick={() => handleCart("realizar")}
                disabled={capas.length < 3}
              >
                Realizar Pedido
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* 3D View */}
      <div className="relative h-[300px] sm:h-[400px] lg:h-[600px] bg-secondary-light rounded-lg">
        <Canvas camera={{ position: [0, 2, 5], fov: 75 }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
          <Suspense fallback={null}>
            <TortaModel capas={capas} />
          </Suspense>
          <OrbitControls
            enableZoom={false}
            minPolarAngle={Math.PI / 4}
            maxPolarAngle={Math.PI / 2}
          />
        </Canvas>
      </div>
    </div>
  );
}
