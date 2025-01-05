// components/DownloadFacturaButton.tsx
"use client";

import pedidoApi from "@/app/controladores/api/pedido-api";
import { Button } from "@react-email/components";

interface DownloadFacturaButtonProps {
  numeroOrden: number;
  className?: string;
  isMobile?: boolean;
}

export default function DownloadFacturaButton({
  numeroOrden,
  className,
  isMobile = false,
}: DownloadFacturaButtonProps) {
  const handleDownloadFactura = async () => {
    console.log("MARICOOOON");
    const factura = await pedidoApi.getFactura(numeroOrden);
    return factura;
  };

  if (isMobile) {
    return (
      <button
        onClick={handleDownloadFactura}
        className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-2.5 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
      >
        Ver Factura
      </button>
    );
  }

  return (
    <Button
      onClick={handleDownloadFactura}
      className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-2.5 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
    >
      <span>Ver Factura</span>
      <span className="sr-only">para orden {numeroOrden}</span>
    </Button>
  );
}
