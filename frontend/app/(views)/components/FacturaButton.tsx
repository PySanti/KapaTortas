// components/DownloadFacturaButton.tsx
"use client";

import pedidoApi from "@/app/controladores/api/pedido-api";
import { transformEstadoPedido } from "@/app/controladores/utilities/transform-estado-pedido";
import { EstadoEnum, Pedido } from "@/app/models/Pedido";
import { Button } from "@react-email/components";

interface DownloadFacturaButtonProps {
  pedido: Pedido;
  className?: string;
  isMobile?: boolean;
}

export default function DownloadFacturaButton({
  pedido,
  isMobile = false,
}: DownloadFacturaButtonProps) {
  const handleDownloadFactura = async () => {
    const factura = await pedidoApi.getFactura(pedido.numero_de_orden);
    return factura;
  };

  const estado = transformEstadoPedido(pedido?.estado);

  if (isMobile) {
    return (
      <button
        onClick={() =>
          pedido?.estado === EstadoEnum.FINALIZADO && handleDownloadFactura()
        }
        className={`${pedido?.estado === EstadoEnum.FINALIZADO ? "bg-white hover:bg-gray-50" : "bg-primary text-white hover:bg-opacity-80"} inline-flex items-center justify-center rounded-md border border-gray-300 px-2.5 py-2 text-sm font-medium text-gray-700 shadow-sm hover: bg-gray-50`}
      >
        {" "}
        {pedido?.estado === EstadoEnum.FINALIZADO ? "Ver Factura" : estado}{" "}
      </button>
    );
  }

  return (
    <Button
      onClick={() =>
        pedido?.estado === EstadoEnum.FINALIZADO && handleDownloadFactura()
      }
      className={`${pedido?.estado === EstadoEnum.FINALIZADO ? "bg-white hover:bg-gray-50" : "bg-primary text-white hover:bg-opacity-80"} inline-flex items-center justify-center rounded-md border border-gray-300 px-2.5 py-2 text-sm font-medium text-gray-700 shadow-sm hover: bg-gray-50`}
    >
      <span>
        {" "}
        {pedido?.estado === EstadoEnum.FINALIZADO ? "Ver Factura" : estado}{" "}
      </span>
      <span className="sr-only">para orden {pedido.numero_de_orden}</span>
    </Button>
  );
}
