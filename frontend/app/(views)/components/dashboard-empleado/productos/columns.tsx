"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { Button } from "@/app/(views)/components/ui/button";
import { Checkbox } from "@/app/(views)/components/ui/checkbox";
import { Categoria, Producto } from "@/app/models/Producto";
import capitalizeFirstLetter from "@/app/controladores/utilities/capitalize-firstletter";
import { DialogModificarProductoById } from "@/app/(views)/components/dialog-modificar-producto";

export const columnsProductos: ColumnDef<Producto>[] = [
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
    accessorKey: "id",
    header: "Id",
  },
  {
    accessorKey: "titulo",
    filterFn: (row, columnId, filterValue) => {
      const search = filterValue.toLowerCase();
      const titulo = row.original?.titulo;
      return titulo.toLowerCase().startsWith(search);
    },
    header: ({ column }) => {
      return (
        <Button
          className="px-0"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Nombre
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "categoria",
    header: ({ column }) => {
      return (
        <Button
          className="px-0"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Categoría
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const producto = row.original;
      return capitalizeFirstLetter(producto.categoria);
    },
  },
  {
    accessorKey: "descripcion",
    header: "Descripción",
  },
  {
    accessorKey: "imagenes",
    header: "Imágenes",
    // Display number of images in the cell
    cell: ({ row }) => {
      const producto = row.original;
      return producto.imagenes.length;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const producto = row.original;

      const { titulo, descripcion, categoria, imagenes } = producto;

      const imagenesDefault = imagenes.join(", ");

      const productData = {
        new_titulo: titulo,
        new_descripcion: descripcion,
        new_categoria: categoria as Categoria,
        new_imagenes: imagenesDefault,
      };

      console.log(productData);

      return <DialogModificarProductoById productoId={producto.id} productData={productData} />;
    },
  },
];
// "relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&>svg]:size-4 [&>svg]:shrink-0"
