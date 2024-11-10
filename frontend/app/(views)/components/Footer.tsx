"use client";

import { useState } from "react";
import Link from "next/link";
import { SendHorizontal } from "lucide-react";
import { Separator } from "@radix-ui/react-separator";
import { Button } from "@/components/ui/button";
import Input from "./Input";
import { DatePicker } from "./DatePicker";
import { date } from "zod";
import { setDate } from "date-fns";

export default function Footer() {
  const [correo, setCorreo] = useState<string>();
  const [fecha, setFecha] = useState<Date | undefined>();

  const handleInputCorreo = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCorreo(e.target.value);
  }
  
  return (
    <footer className="bg-terciary mt-auto w-full bottom-0 left-0 z-10">
      <div className="container px-4 py-8 mx-auto">
        <div className="grid md:grid-cols-2 gap-2">
          {/* Left */}
          <div>
            <h1 className="text-secondary text-3xl">Invítanos a tu Fiesta</h1>
            <p>Recibe descuentos especiales el día de tu cumpleaños</p>
            <div className="flex p-2">
              <form className="flex flex-col sm:flex-row gap-2">
                <Input 
                  type="text"
                  placeholder="Tu Correo*"
                  value={correo}
                  inputHandler={ handleInputCorreo }
                />
                <DatePicker date={ fecha } setDate={ setFecha } />
                
              </form>
              <Button className="rounded-full hover:bg-primary-light">
               <SendHorizontal />
              </Button>
            </div>
          </div>
          {/* Right */}
          <div className="space-y-4 md:text-right">
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
