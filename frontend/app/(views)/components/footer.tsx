"use client";

import Link from "next/link";
import { Button } from "@/app/(views)/components/ui/button";
import redirectToWhatsapp from "@/app/controladores/utilities/redirect-to-whatsapp";
import { FaWhatsapp } from "react-icons/fa";
import getCurrentUser from "@/app/controladores/utilities/get-current-user";

export default function Footer() {
  const session = getCurrentUser();

  return (
    <footer className="bg-terciary mt-auto w-full bottom-0 left-0 z-10 min-h-fit">
      <div className="container px-4 py-8 mx-auto text-center">
        <div className="grid md:grid-cols-2 gap-2">
          {/* Left */}
          <div className="text-left space-y-4 p-2">
            <h1 className="text-secondary text-3xl">Invítanos a tu Fiesta</h1>
            <p className="p-secondary">
              Podemos visitarte en tu fiesta de cumpleaños.{" "}
            </p>
          </div>
          {/* Right */}
          <div className="space-y-4 text-left ml-4 mt-0 md:ml-0 lg:mt-4 md:text-right">
            <nav className="space-y-2">
              <Link
                href="/products/personalizar"
                className="hover:text-secondary-light"
              >
                <p className="p-secondary">Crea tu Torta</p>
              </Link>
              <Link href="/nosotros" className="hover:text-secondary-light">
                <p className="p-secondary">Nosotros</p>
              </Link>
              <Button
                className=" hover:text-secondary-light"
                onClick={() =>
                  redirectToWhatsapp({
                    name: session?.name || "",
                  })
                }
              >
                <FaWhatsapp className="text-secondary-light" />
                <h3 className="text-secondary-light">+58 424 218 5034</h3>
              </Button>
            </nav>
          </div>
        </div>
        <div className="flex sm:inline-flex justify-between items-center m-4 mb-0 gap-4 mt-8 p-2">
          <Link href="#" className="hover:text-white">
            <p className="p-secondary text-sm">Términos de Servicio</p>
          </Link>
          {/* <Separator className="my-4" orientation="vertical" /> */}
          <span className="text-lg text-secondary">|</span>
          {/* <Divider orientation="vertical" flexItem /> */}
          <Link href="#" className="hover:text-white">
            <p className="p-secondary text-sm">@2024 Kapa Tortas</p>
          </Link>
        </div>
      </div>
    </footer>
  );
}
