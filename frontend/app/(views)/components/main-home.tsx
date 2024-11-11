import Home from "@/app/(marketing)/page";
import { MainButton } from "./MainButton";
import Logo from "@/components/images/Logo";
import Link from "next/link";

import HomePhoto from "@/components/images/HomePhoto";
import Eyes from "@/components/images/Eyes";

interface ScrollButtonProps {
  scrollToSection: () => void;
}

export default function MainHome({ scrollToSection }: ScrollButtonProps) {

  return (
    <div className="relative">
      <div className="relative w-full h-[75vh]  mx-auto">
        <div className="absolute top-0 inset-0 bg-cover">
          <HomePhoto />
        </div>
        <div
          className="absolute inset-0 z-10 items-center -mt-8 ml-2 md:ml-10 lg:-mt-4 xl:ml-2 xl:-mt-8"
          style={{
            top: "55%",
            left: "20%",
            transform: "translate(-10%, -50%)",
          }}
        >
          <Eyes />
        </div>

        {/* Contenido */}
        <div className="relative z-10 flex h-full flex-col justify-center pt-10 px-4 sm:px-6 lg:px-8">
          <div
            className="mr-auto p-7 md:p-4 lg:p-0 max-w-3xl lg:ml-56"
            style={{ left: "60%" }}
          >
            <h1 className="mb-6 text-4xl text-center sm:text-5xl md:text-6xl md:text-left">
              Cada bocado está lleno de creatividad
            </h1>
            <p className="mb-8 text-center md:text-left max-w-2xl">
              Llega Diciembre y sabemos que quieres tener un detalle con tus
              seres queridos. Prueba nuestros irresistibles nuevos sabores.
            </p>
            <div className="text-center md:text-left">
                <MainButton variant="secondary" onClick={ scrollToSection }>Visita el Catálogo</MainButton>
            </div>
          </div>
        </div>

        {/* Boton */}
      </div>
    </div>
  );
}
