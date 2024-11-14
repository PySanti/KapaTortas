"use client"

import { Pedido } from "@/app/models/Pedido"
import { usePedidoStore } from "@/src/usePedidoStore"


import { EstadoEnum, MetodoPago, MetodoEntrega } from "@/app/models/Pedido";

const examplePedido: Pedido = {
    numero_de_orden: 12345,
    fecha_pedido: '2024-11-12',
    fecha_entrega: '2024-11-15',
    monto_total: '150.00',
    estado: EstadoEnum.PENDIENTE,
    metodo_pago: MetodoPago.ZELLE,
    metodo_entrega: MetodoEntrega.DELIVERY,
    direccion_entrega: {
      id: 1,
      pais: 'Venezuela',
      estado: 'Distrito Capital',
      ciudad: 'Caracas',
      direccion: 'Avenida Principal, edificio #23',
      referencia: 'Cerca de la plaza',
      codigo_postal: 1010,
    },
    descripciones: [
      {
        titulo: 'Producto A',
        id_producto_asociado: 1001,
        presentacion: 'Caja de 10 unidades',
        precio_presentacion: '50.00',
        cantidad: 2,
        imagenes_producto: [
          'https://example.com/image1.jpg',
          'https://example.com/image2.jpg'
        ]
      },
      {
        titulo: 'Producto B',
        id_producto_asociado: 1002,
        presentacion: 'Paquete de 5 unidades',
        precio_presentacion: '25.00',
        cantidad: 2,
        imagenes_producto: [
          'https://example.com/image3.jpg'
        ]
      }
    ]
  };

export default function MainPedido() {
    const { product, extras, present } = usePedidoStore();

    return (
       <div className="bg-white">
            {/* Separación color bg */}


       </div>
    )
}