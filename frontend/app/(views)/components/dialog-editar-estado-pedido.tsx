"use client";

import { useState } from "react";
import { ChevronsUpDown } from "lucide-react";
import { Button } from "@/app/(views)/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/app/(views)/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/(views)/components/ui/select";
import { EstadoEnum } from "@/app/models/Pedido";
import { transformEstadoPedido } from "@/app/controladores/utilities/transform-estado-pedido";
import pedidoApi from "@/app/controladores/api/pedido-api";
import { useRouter } from "next/navigation";

interface DialogEditarEstadoPedidoProps {
  orderId: number;
  currentStatus: EstadoEnum;
}

export const estadosCambioPedido = [
  { label: "En proceso", value: EstadoEnum.EN_PROCESO },
  { label: "Cancelado", value: EstadoEnum.CANCELADO },
  { label: "Finalizado", value: EstadoEnum.FINALIZADO },
];

const onStatusChange = async (router: any, orderId: number, newStatus: EstadoEnum) => {
  try {
    // Implement your API call here to update the order status
    //console.log(`Updating order ${orderId} to status ${newStatus}`);
    const estadoActualizado = await pedidoApi.editarEstadoPedido(orderId, newStatus);

    if (estadoActualizado) {
      console.log("Estado actualizado con éxito");
      // Refresh page luego de editar el estado del pedido
      router.refresh();
    } else {
      console.error("Error al actualizar el estado del pedido");
    }
  } catch (error) {
    console.error("Error editando el estado del pedido:", error);
  }
};

export function DialogEditarEstadoPedido({
  orderId,
  currentStatus,
}: DialogEditarEstadoPedidoProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState(EstadoEnum.EN_PROCESO); // Default to En Proceso
  const router = useRouter();

  const handleStatusChange = () => {
    onStatusChange(router, orderId, status);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Abrir menú</span>
          <ChevronsUpDown className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-terciary">Cambiar Estado de Orden #{orderId}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <div className="gap-y-2">
            <p className="text-sm text-terciary font-medium">
              Estado actual: {transformEstadoPedido(currentStatus)}
            </p>
          </div>
          <div className="gap-y-2">
            <p className="text-sm text-terciary font-medium">Nuevo estado:</p>
            <Select value={status} onValueChange={(value) => setStatus(value as EstadoEnum)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Seleccionar estado" />
              </SelectTrigger>
              <SelectContent>
                {estadosCambioPedido.map((estado) => (
                  <SelectItem key={estado.value} value={estado.value}>
                    {estado.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button className="w-full" variant={"terciary"} onClick={handleStatusChange}>
            Guardar Cambios
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
