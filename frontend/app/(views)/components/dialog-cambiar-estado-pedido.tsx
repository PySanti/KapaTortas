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
import capitalizeFirstLetter from "@/app/controladores/utilities/capitalize-firstletter";
import { Badge } from "./ui/badge";

const estados = [
  // { label: "Pendiente", value: EstadoEnum.PENDIENTE },
  { label: "Finalizado", value: EstadoEnum.FINALIZADO },
  { label: "Cancelado", value: EstadoEnum.CANCELADO },
];

interface DialogCambiarEstadoPedidoProps {
  orderId: string;
  currentStatus: EstadoEnum;
}

const onStatusChange = async (orderId: string, newStatus: EstadoEnum) => {
  try {
    // Implement your API call here to update the order status
    console.log(`Updating order ${orderId} to status ${newStatus}`);

    // After successful update, you might want to refresh your data
    // await refetchData()
  } catch (error) {
    console.error("Error updating order status:", error);
  }
};

export function DialogCambiarEstadoPedido({
  orderId,
  currentStatus,
}: DialogCambiarEstadoPedidoProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState(EstadoEnum.FINALIZADO); // Default to Finalizado

  const handleStatusChange = () => {
    onStatusChange(orderId, status);
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
              Estado actual: {capitalizeFirstLetter(currentStatus)}
            </p>
          </div>
          <div className="gap-y-2">
            <p className="text-sm text-terciary font-medium">Nuevo estado:</p>
            <Select value={status} onValueChange={(value) => setStatus(value as EstadoEnum)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Seleccionar estado" />
              </SelectTrigger>
              <SelectContent>
                {estados.map((estado) => (
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
