"use client";

import { useState } from "react";
import Image from "next/image";

import { Session } from "next-auth";
import { Cliente } from "@/app/models/Cliente";
import { formatDescripciones } from "@/app/models/Pedido";
import { OrderDetails } from "@/app/models/Pedido";


import { ItemFormat } from "@/app/models/Pedido";
import { Categoria, Presentacion, Producto } from "@/app/models/Producto";

import GalleryImage from "./images/GalleryImage";
import DataPedido from "./data-pedido";

// testtt
// PRESENTACION
const examplePresentacion: Presentacion = {
    id: 1,
    ref: "L",
    proporcion: "1L",
    precio: "12.50",
    stock: 20,
    calorias: "250",
  };

  const exampleProducto: Producto = {
    id: 1,
    titulo: "Organic Apple Juice",
    categoria: "postre",
    descripcion: "Fresh organic apple juice, no added sugar.",
    presentaciones: [
      {
        id: 1,
        ref: "L",
        proporcion: "1L",
        precio: "12.50",
        stock: 20,
        calorias: "250",
      },
      {
        id: 2,
        ref: "500ml",
        proporcion: "500ml",
        precio: "7.00",
        stock: 15,
        calorias: "125",
      },
    ],
    imagenes: [
      "https://res.cloudinary.com/dhxc2ozvw/image/upload/v1731461803/kapatortas/kehirlnc2rcnra7b2fdg.png",
    ],
    reviews: [
      {
        calificacion: 5,
        descripcion: "Excellent taste!",
        autor_review: "user123",
      },
      {
        calificacion: 4,
        descripcion: "Very refreshing.",
        autor_review: "user456",
      },
    ],
  };

  const exampleProductos: Producto[] = [
    {
      id: 1,
      titulo: "Organic Apple Juice",
      categoria: "extra",
      descripcion: "Fresh organic apple juice, no added sugar.",
      presentaciones: [
        {
          id: 1,
          ref: "L",
          proporcion: "1L",
          precio: "12.50",
          stock: 20,
          calorias: "250",
        },
        {
          id: 2,
          ref: "500ml",
          proporcion: "500ml",
          precio: "7.00",
          stock: 15,
          calorias: "125",
        },
      ],
      imagenes: [
        "https://res.cloudinary.com/dhxc2ozvw/image/upload/v1731461803/kapatortas/kehirlnc2rcnra7b2fdg.png",
        "https://res.cloudinary.com/dhxc2ozvw/image/upload/v1731461803/kapatortas/kehirlnc2rcnra7b2fdg.png",
      ],
      reviews: [
        {
            calificacion: 5,
            descripcion: "Excellent taste!",
            autor_review: "user123",
        },
      ],
    },
    {
      id: 2,
      titulo: "Almond Milk",
      categoria: "extra",
      descripcion: "Organic almond milk, rich in vitamins.",
      presentaciones: [
        {
          id: 1,
          ref: "L",
          proporcion: "1L",
          precio: "15.00",
          stock: 30,
          calorias: "100",
        },
        {
          id: 2,
          ref: "250ml",
          proporcion: "250ml",
          precio: "4.00",
          stock: 40,
          calorias: "25",
        },
      ],
      imagenes: [
        "https://res.cloudinary.com/dhxc2ozvw/image/upload/v1731461803/kapatortas/kehirlnc2rcnra7b2fdg.png",
        "https://res.cloudinary.com/dhxc2ozvw/image/upload/v1731461803/kapatortas/kehirlnc2rcnra7b2fdg.png",
      ],
      reviews: [
        {
            calificacion: 5,
            descripcion: "Excellent taste!",
            autor_review: "user123",
        },
      ],
    },
  ];
  
export default function MainPedido({ perfil }: { perfil: Cliente | null
 }) {
//   const { product, extras, present } = usePedidoStore();
    const product = exampleProducto;
    const present = examplePresentacion;
    const extras = exampleProductos;

//   Price
  const SUBTOTAL: number = Number(present?.precio || 0) + 
  (extras && extras.length > 0
    ? extras
        .filter((item) => item.presentaciones.length > 0)
        .reduce((total, item) => total + Number(item.presentaciones[0].precio || 0), 0)
    : 0);
    // Lista productos 
    const listProducts: Producto[] = [product , ...(extras || [])];

    const descripciones: formatDescripciones[] = listProducts.map((item) => {
        return {
            cantidad: 1,
            id_producto: item.id,
            id_presentacion: item.categoria === Categoria.POSTRE ? present.id : item.presentaciones.length > 0 ? item.presentaciones[0].id : 0,
        }
    }) 

    const order: ItemFormat[] = listProducts.map((item) => {
        const calculatedPrice = item.categoria === Categoria.POSTRE
            ? Number(present.precio) 
            : item.presentaciones.length > 0
                ? Number(item.presentaciones[0].precio) 
                : 0;
    
        return {
            title: item.titulo,
            quantity: 1,
            price: calculatedPrice,
        };
    });
    // Delivery
    const [deliveryPrice, setDeliveryPrice] = useState<number>(0);

    // Total
    const [total, setTotal] = useState<number>(SUBTOTAL + deliveryPrice);

    // Impuestos
    const [iva, setIva] = useState<number>(total * (16/100));

    // Test....
    function deliveryPriceHandler(item: number) {
        setDeliveryPrice(item);
        const newTotal = SUBTOTAL + item;
        setTotal(newTotal);
        setIva(newTotal * (16 / 100));
    }


  return (
    <div className="bg-white">
      {/* TESTING */}
      {/* <p>{product?.titulo}</p>
      <p>{product?.categoria}</p>
      <p>{extras?.[0].titulo}</p>
      <p>{present?.calorias}</p> */}

      {/* Separación color bg */}
      <div className="fixed right-0 top-0 hidden h-full w-1/2 bg-white lg:block" aria-hidden="true" />

      <div className="relative mx-auto grid max-w-7xl grid-cols-1 gap-x-16 lg:grid-cols-2 lg:px-8 lg:pt-16">
            <h1 className="sr-only">Procesar Compra</h1>

            <section
          className="bg-terciary py-12 text-indigo-300 md:px-10 lg:col-start-2 lg:row-start-1 lg:mx-auto lg:w-full lg:max-w-lg">
            <div className="mx-auto max-w-2xl px-4 lg:max-w-none lg:px-0">
                <h2 className="sr-only">
                Order summary
                </h2>

                <h2 className="mt-1 text-3xl font-bold tracking-tight text-secondary-light">Productos</h2>

                {/* SECCION PRODUCTOS */}

                <ul role="list" className="divide-y divide-white divide-opacity-10 text-sm font-medium">
                        { listProducts.map((product, index) => (
                            <li key={index} className="flex items-start space-x-4 py-6">
                                <GalleryImage
                                    path={product?.imagenes && product.imagenes.length > 0 ? product.imagenes[0] : ""}
                                    alt={product.titulo}
                                    className="h-20 w-20 flex-none rounded-md object-cover object-center"
                                    />
                                    <div className="flex-auto space-y-1">
                                        <h3 className="text-secondary-light">{product.titulo}</h3>
                                        <p className="text-secondary-light text-opacity-40">{present && present.proporcion}</p>
                                    </div>
                                    <h3 className="flex-none text-lg font-medium text-secondary">{product.categoria === Categoria.POSTRE ? present?.precio : "Extra"}</h3>
                            </li>
                        )) }
                </ul>


                {/* SECCION PRECIOS */}
                <dl className="space-y-6 border-t border-secondary-light border-opacity-10 pt-6  font-medium text-secondary-light text-base">
                    <div className="flex items-center justify-between">
                        <dt>Subtotal</dt>
                        <dd>${SUBTOTAL}</dd>
                    </div>

                    <div className="flex items-center justify-between">
                        <dt>Delivery</dt>
                        <dt>${deliveryPrice}</dt>
                        
                    </div>

                    <div className="flex items-center justify-between">
                        <dt>IVA</dt>
                        <dd>${iva}</dd>
                    </div>

                    <div className="flex items-center justify-between border-t border-white border-opacity-10 pt-6 text-secondary-light">
                        <dt className="text-base">Total</dt>
                        <dd className="text-base">${total}</dd>
                    </div>
                </dl>
            </div>
          </section>

          <section className="py-16 lg:col-start-1 lg:row-start-1 lg:mx-auto lg:w-full lg:max-w-kg lg:pb-24 lg:pt-0">
                <DataPedido perfilDir={perfil?.direccion_preferida} order={order} deliveryPriceHandler={deliveryPriceHandler} total={total} />            

          </section>
        
        </div> 
    </div>
  );
}
