'use client';

import { useRef, useState } from 'react';
import { Cliente } from '@/app/models/Cliente';
import ClienteAPI from '@/app/controladores/api/users/ClienteAPI';
import MainHome from './main-home';
import ItemProducto from './item-producto';
import { useSmoothScroll } from '@/app/controladores/utilities/use-smooth-scroll';

import { Rol } from '@/app/models/RolEnum';
import { Categoria } from '@/app/models/Producto';
import { Producto } from '@/app/models/Producto';
import ProductHome from './product-home';

// const productoList: Producto[] = [producto1, producto2];

export default function HomePage({ productos }: { productos: Producto[] }) {
  const sectionCatalogoRef = useRef<HTMLDivElement>(null);
  const scrollToSection = useSmoothScroll(sectionCatalogoRef);

  if (!Array.isArray(productos)) {
    console.error('Expected productos to be an array, received:', productos);
    return <p>No se pudieron cargar los Productos</p>;
  }

  return (
    <>
      <MainHome scrollToSection={scrollToSection} />

      <ProductHome sectionCatalogoRef={sectionCatalogoRef} productos={productos} />
    </>
  );
}
