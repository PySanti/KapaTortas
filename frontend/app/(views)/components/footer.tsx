"use client";

import { useState } from "react";
import Link from "next/link";
import { SendHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DatePicker } from "./date-picker";
import { Input } from "@/components/ui/input";

export default function Footer() {
  const [correo, setCorreo] = useState<string>();
  const [fecha, setFecha] = useState<Date | undefined>();

  return (
    <footer className="bg-terciary mt-auto w-full bottom-0 left-0 z-10 min-h-fit">
      <div className="container px-4 py-8 mx-auto text-center">
        <div className="grid md:grid-cols-2 gap-2">
          {/* Left */}
          <div className="text-left space-y-4 p-2">
            <h1 className="text-secondary text-3xl">Invítanos a tu Fiesta</h1>
            <p>Recibe descuentos especiales el día de tu cumpleaños. </p>
            <div className="flex p-2">
              <form className="flex flex-col sm:flex-row gap-3">
                <Input
                  variant="footer"
                  type="text"
                  placeholder="Tu Correo*"
                  value={correo}
                  onChange={(e) => {
                    setCorreo(e.target.value);
                  }}
                  className="text-secondary-light"
                />
                <DatePicker date={fecha} setDate={setFecha} />
                <Button className="rounded-full hover:bg-primary-light">
                  <SendHorizontal />
                </Button>
              </form>
            </div>
          </div>
          {/* Right */}
          <div className="space-y-4 text-left ml-4 mt-0 md:ml-0 lg:mt-4 md:text-right">
            <nav>
              <Link href="#">
                <p>Contacto</p>
              </Link>
              <Link href="#">
                <p>FAQ</p>
              </Link>
              <Link href="#">
                <p>Nosotros</p>
              </Link>
              <Link href="#">
                <h1>+58 424 218 5034</h1>
              </Link>
            </nav>
          </div>
        </div>
        <div className="flex sm:inline-flex justify-between items-center m-4 mb-0 gap-4 mt-8 p-2">
          <Link href="#" className="hover:text-white">
            <p className="text-sm">Términos de Servicio</p>
          </Link>
          {/* <Separator className="my-4" orientation="vertical" /> */}
          <span className="text-lg text-secondary">|</span>
          {/* <Divider orientation="vertical" flexItem /> */}
          <Link href="#" className="hover:text-white">
            <p className="text-sm">@2024 Kapa Tortas</p>
          </Link>
        </div>
      </div>
    </footer>
  );
}
