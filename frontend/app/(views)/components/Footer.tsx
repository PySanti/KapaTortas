"use client";

import { useState } from "react";
import Link from "next/link";
import { SendHorizontal } from "lucide-react";
import { Separator } from "@radix-ui/react-separator";

export default function Footer() {
  const [correo, setCorreo] = useState<string>();
  const [fecha, setFecha] = useState<string>();

  return (
    <footer className="bg-terciary mt-auto w-full bottom-0 left-0 z-10">
      <div className="container px-4 py-8 mx-auto">
        <div className="grid md:grid-cols-2 gap-2">
          {/* Left */}
          <div>
            <h1 className="text-secondary text-3xl">Invítanos a tu Fiesta</h1>
            <p>Recibe descuentos especiales el día de tu cumpleaños</p>
            <div className="flex p-2">
              <input
                type="text"
                placeholder="Tu Correo*"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
              />
              <input
                type="text"
                placeholder="Fecha de Cumpleaños"
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
              />
              <SendHorizontal />
            </div>
          </div>
          {/* Right */}
          <div className="text-left">
            <h3>Contacto</h3>
            <h3>FAQ</h3>
            <h3>Nosotros</h3>
            <Link href="/phone">
              <h1>+58 424 218 5034</h1>              
            </Link>
          </div>
        </div>
        <div className="relative text-center">
          <p>Términos de Servicio</p>
          <Separator orientation="vertical" />
          {/* <Divider orientation="vertical" flexItem /> */}
          <p>@2024 Kapa Tortas</p>
        </div>
      </div>
    </footer>
  );
}
