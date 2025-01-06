"use client";
import { useState } from "react";
import { Pedido } from "@/app/models/Pedido";
import { Button } from "./ui/button";
import { XIcon } from "lucide-react";
import { EstadoEnum } from "@/app/models/Pedido";
import pedidoApi from "@/app/controladores/api/pedido-api";
import { useRouter } from "next/navigation";

interface CancelarButtonProps {
  pedido: Pedido;
}

export default function CancelarPedidoButton({ pedido }: CancelarButtonProps) {
  const router = useRouter();
  const [pedidoEstado, setPedidoEstado] = useState(pedido.estado);

  const handleCancelarPedido = async () => {
    const cancelar = await pedidoApi.editarEstadoPedido(
      pedido.numero_de_orden,
      EstadoEnum.CANCELADO,
    );
    if (cancelar) {
      // Update the local state to trigger a re-render
      setPedidoEstado(EstadoEnum.CANCELADO);
      router.refresh();
    }
  };

  return (
    <Button
      className="h-8 w-8 rounded-full bg-red-500 hover:bg-red-300"
      onClick={handleCancelarPedido}
      disabled={pedidoEstado !== EstadoEnum.RECIBIDO}
    >
      <XIcon />
    </Button>
  );
}
