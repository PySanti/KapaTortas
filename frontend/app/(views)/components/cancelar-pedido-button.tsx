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
  const [isLoading, setIsLoading] = useState(false);

  const handleCancelarPedido = async () => {
    setIsLoading(true);
    const cancelar = await pedidoApi.editarEstadoPedido(
      pedido.numero_de_orden,
      EstadoEnum.CANCELADO
    );
    if (cancelar) {
      // Update page cuando el pedido cambia de estado a cancelado
      setPedidoEstado(EstadoEnum.CANCELADO);
      setIsLoading(false);
      router.refresh();
    }
  };

  return pedidoEstado === EstadoEnum.RECIBIDO ? (
    <Button
      className="h-6 w-6 p-0 rounded-full bg-rose-700 hover:bg-red-600"
      onClick={handleCancelarPedido}
      disabled={isLoading}
    >
      <XIcon className="h-6 w-6" />
    </Button>
  ) : null;
}
