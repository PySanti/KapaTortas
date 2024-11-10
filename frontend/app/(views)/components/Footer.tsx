"use client";

import { useState } from "react";

export default function Footer() {
  const [correo, setCorreo] = useState<string>();
  const [fecha, setFecha] = useState<string>();

  return (
    <footer>
      <div className="sticky bg-terciary p-4">
        <div className="grid grid-cols-2">
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
            </div>
          </div>
          {/* Right */}
          <div></div>
        </div>
      </div>
    </footer>
  );
}
