"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { Button } from "@/app/(views)/components/ui/button";
import { Checkbox } from "@/app/(views)/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/app/(views)/components/ui/dropdown-menu";
import { Badge } from "@/app/(views)/components/ui/badge";
import { EstadoEnum, Pedido } from "@/app/models/Pedido";
import capitalizeFirstLetter from "@/app/controladores/utilities/capitalize-firstletter";
import { cn } from "@/app/controladores/lib/utils";
import { transformEstadoPedido } from "@/app/controladores/utilities/transform-estado-pedido";

// Helper para obtener el estilo de un badge según el estado del pedido
function getBadgeVariant(estado: string) {
  switch (estado) {
    case EstadoEnum.RECIBIDO:
      return "gray"; // Style for 'recibido'
    case EstadoEnum.EN_PROCESO:
      return "default"; // Style for 'en_proceso'
    case EstadoEnum.CANCELADO:
      return "destructive"; // Style for 'en_proceso'
    case EstadoEnum.FINALIZADO:
      return "terciary"; // Style for 'finalizado'
    default:
      return "default"; // Fallback style
  }
}

function getBadgeTextColor(estado: string) {
  switch (estado) {
    case EstadoEnum.RECIBIDO:
      return "text-black";
    default:
      return "text-white";
  }
}

export const columnsPedidos: ColumnDef<Pedido>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Seleccionar todos"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Seleccionar fila"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "numero_de_orden",
    filterFn: (row, columnId, filterValue) => {
      const search = filterValue.toLowerCase();
      const numeroOrden = row.original?.numero_de_orden;

      // Ensure numeroOrden is a string for comparison
      const value = typeof numeroOrden === "number" ? String(numeroOrden) : numeroOrden;

      // Use startsWith for stricter matching
      return value?.toLowerCase().startsWith(search);
    },
    header: "N° Orden",
    cell: ({ row }) => {
      return row.original.numero_de_orden;
    },
  },
  {
    accessorKey: "fecha_pedido",
    header: ({ column }) => {
      return (
        <Button
          className="px-0"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Fecha Pedido
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const date = new Date(row.getValue("fecha_pedido"));
      const formattedDate = date.toLocaleString("es-VE", {
        timeZone: "America/Caracas",
      });
      return <div>{formattedDate}</div>;
    },
    meta: {
      headerClassName: "w-[200px]",
    },
  },
  {
    accessorKey: "fecha_entrega",
    header: ({ column }) => {
      return (
        <Button
          className="px-0"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Fecha Entrega
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const date = new Date(row.getValue("fecha_entrega"));
      const formattedDate = date.toLocaleString("es-VE", {
        timeZone: "America/Caracas",
      });
      return <div>{formattedDate}</div>;
    },
    meta: {
      headerClassName: "w-[200px]",
    },
  },
  {
    accessorKey: "monto_total",
    header: ({ column }) => {
      return (
        <Button
          className="px-0"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Total
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      // Access nested data
      const total = row.original?.monto_total;

      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(total);

      return <div>{formatted}</div>;
    },
    meta: {
      headerClassName: "w-[100px]",
    },
  },
  {
    accessorKey: "estado",
    header: "Estado",
    cell: ({ row }) => {
      const estado = row.getValue("estado") as string;
      return (
        <Badge
          variant={getBadgeVariant(estado)}
          className={cn(getBadgeTextColor(estado), "font-medium")}
        >
          {transformEstadoPedido(estado as EstadoEnum)}
        </Badge>
      );
    },
  },

  {
    accessorKey: "pedido_asociado.descripciones",
    header: "Productos",
    cell: ({ row }) => {
      const descripciones = row.original?.descripciones;
      return <div>{descripciones?.map((d) => `${d.cantidad}x ${d.titulo}`).join(", ")}</div>;
    },
    meta: {
      headerClassName: "w-[200px]",
    },
  },
  {
    accessorKey: "metodo_entrega",
    header: "Entrega",
    cell: ({ row }) => {
      // Capitalize first letter from metodoEntrega
      const metodoEntrega = capitalizeFirstLetter(row.original?.metodo_entrega);
      return <div>{metodoEntrega}</div>;
    },
    meta: {
      headerClassName: "w-[100px]",
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const pedido = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Abrir menú</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Acciones</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(pedido.numero_de_orden.toString())}
            >
              Copiar ID de orden
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
