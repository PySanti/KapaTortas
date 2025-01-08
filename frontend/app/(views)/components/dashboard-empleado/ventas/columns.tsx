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
import { Venta } from "@/app/models/venta";
import capitalizeFirstLetter from "@/app/controladores/utilities/capitalize-firstletter";

export const columnsVentas: ColumnDef<Venta>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
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
    accessorKey: "numero_de_orden", // Use a flattened key
    filterFn: (row, columnId, filterValue) => {
      const search = filterValue.toLowerCase();
      const numeroOrden = row.original?.pedido_asociado?.numero_de_orden;

      // Ensure numeroOrden is a string for comparison
      const value =
        typeof numeroOrden === "number" ? String(numeroOrden) : numeroOrden;

      // Use startsWith for stricter matching
      return value?.toLowerCase().startsWith(search);
    },
    header: "N° Orden",
    cell: ({ row }) => {
      // Access nested data
      return row.original.pedido_asociado.numero_de_orden;
    },
  },
  {
    accessorKey: "fecha",
    header: ({ column }) => {
      return (
        <Button
          className="px-0"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Fecha
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const date = new Date(row.getValue("fecha"));
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
    accessorKey: "pedido_asociado.monto_total",
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
      const total = row.original?.pedido_asociado?.monto_total;

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
    accessorKey: "pedido_asociado.descripciones",
    header: "Productos",
    cell: ({ row }) => {
      const descripciones = row.original?.pedido_asociado?.descripciones;
      return (
        <div>
          {descripciones?.map((d) => `${d.cantidad}x ${d.titulo}`).join(", ")}
        </div>
      );
    },
    meta: {
      headerClassName: "w-[200px]",
    },
  },
  {
    accessorKey: "pedido_asociado.metodo_entrega",
    header: "Entrega",
    cell: ({ row }) => {
      // Capitalize first letter from metodoEntrega
      const metodoEntrega = capitalizeFirstLetter(
        row.original?.pedido_asociado?.metodo_entrega,
      );
      return <div>{metodoEntrega}</div>;
    },
    meta: {
      headerClassName: "w-[100px]",
    },
  },
  {
    accessorKey: "pedido_asociado.direccion_entrega",
    header: "Dirección de Envío",
    cell: ({ row }) => {
      const direccion = row.original?.pedido_asociado?.direccion_entrega;
      return (
        // <div>{`${direccion.direccion}, ${direccion.ciudad}, ${direccion.estado}, ${direccion.pais}`}</div>
        // Por ahora solo se maneja Venezuela
        <div>{`${direccion?.direccion}, ${direccion?.ciudad}, ${direccion?.estado}`}</div>
      );
    },
    meta: {
      headerClassName: "w-[320px]",
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const venta = row.original;

      const copyDireccionEnvio = () => {
        const direccion = venta.pedido_asociado.direccion_entrega;

        const formattedAddress = `${direccion.direccion}, ${direccion.ciudad}, ${direccion.estado}`;
        navigator.clipboard.writeText(formattedAddress);
      };

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
              onClick={() =>
                navigator.clipboard.writeText(
                  venta.pedido_asociado.numero_de_orden.toString(),
                )
              }
            >
              Copiar ID de orden
            </DropdownMenuItem>
            <DropdownMenuItem onClick={copyDireccionEnvio}>
              Copiar Dirección de entrega
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
