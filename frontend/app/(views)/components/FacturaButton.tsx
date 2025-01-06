"use client";

import pedidoApi from "@/app/controladores/api/pedido-api";
import { cn } from "@/app/controladores/lib/utils";
import { transformEstadoPedido } from "@/app/controladores/utilities/transform-estado-pedido";
import { EstadoEnum, Pedido } from "@/app/models/Pedido";
import { Button } from "@/app/(views)/components/ui/button";

interface DownloadFacturaButtonProps {
  pedido: Pedido;
  className?: string;
  isMobile?: boolean;
}

const getStatusColor = (estado: EstadoEnum) => {
  switch (estado) {
    case EstadoEnum.RECIBIDO:
      return "";
    case EstadoEnum.EN_PROCESO:
      return "bg-emerald-500";
    case EstadoEnum.CANCELADO:
      return "bg-rose-700";
    case EstadoEnum.FINALIZADO:
      return "";
    default:
      return "";
  }
};

export default function DownloadFacturaButton({
  pedido,
  isMobile = false,
}: DownloadFacturaButtonProps) {
  const handleDownloadFactura = async () => {
    const factura = await pedidoApi.getFactura(pedido.numero_de_orden);
    return factura;
  };

  const estado = transformEstadoPedido(pedido?.estado);
  const statusColor = getStatusColor(pedido?.estado);
  const pedidoFinalizado = pedido?.estado === EstadoEnum.FINALIZADO;
  const pedidoRecibido = pedido?.estado === EstadoEnum.RECIBIDO;

  return (
    <Button
      onClick={() => pedidoFinalizado && handleDownloadFactura()}
      className={cn(
        "flex items-center gap-x-2 px-4 py-2 text-sm text-gray-700 bg-white hover:bg-white",
      )}
    >
      {!(pedidoFinalizado || pedidoRecibido) && (
        <span
          className={cn("inline-block h-2 w-2 rounded-full", statusColor)}
        />
      )}

      <span>{pedidoFinalizado ? "Ver Factura" : estado}</span>
      {!isMobile && (
        <span className="sr-only">para orden {pedido.numero_de_orden}</span>
      )}
    </Button>
  );
}
