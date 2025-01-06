"use client";

import { useRef } from "react";
import MainHome from "./main-home";
import { useSmoothScroll } from "@/app/controladores/utilities/use-smooth-scroll";
import { Producto } from "@/app/models/Producto";
import ProductHome from "./product-home";
import PersonalizaHome from "./personaliza-home";

// const productoList: Producto[] = [producto1, producto2];

export default function HomePage({ productos }: { productos: Producto[] }) {
  const sectionCatalogoRef = useRef<HTMLDivElement>(null);
  const scrollToSection = useSmoothScroll(sectionCatalogoRef);

  if (!Array.isArray(productos)) {
    console.error("Expected productos to be an array, received:", productos);
    return <p>No se pudieron cargar los Productos</p>;
  }

  return (
    <>
      <MainHome scrollToSection={scrollToSection} />

      <PersonalizaHome />

      <ProductHome
        sectionCatalogoRef={sectionCatalogoRef}
        productos={productos}
      />
    </>
  );
}
