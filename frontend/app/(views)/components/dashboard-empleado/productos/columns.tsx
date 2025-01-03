'use client';

import type { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, MoreHorizontal } from 'lucide-react';
import { Button } from '@/app/(views)/components/ui/button';
import { Checkbox } from '@/app/(views)/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/app/(views)/components/ui/dropdown-menu';
import { Producto } from '@/app/models/Producto';
import capitalizeFirstLetter from '@/app/controladores/utilities/capitalize-firstletter';
import { cn } from '@/app/controladores/lib/utils';

export const columnsProductos: ColumnDef<Producto>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label='Seleccionar todos'
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label='Seleccionar fila'
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'id',
    header: 'Id',
  },
  {
    accessorKey: 'titulo',
    filterFn: (row, columnId, filterValue) => {
      const search = filterValue.toLowerCase();
      const titulo = row.original?.titulo;
      return titulo.toLowerCase().startsWith(search);
    },
    header: ({ column }) => {
      return (
        <Button
          className='px-0'
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Nombre
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      );
    },
  },
  {
    accessorKey: 'categoria',
    header: ({ column }) => {
      return (
        <Button
          className='px-0'
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Categoría
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      );
    },
    cell: ({ row }) => {
      const producto = row.original;
      return capitalizeFirstLetter(producto.categoria);
    },
  },
  {
    accessorKey: 'descripcion',
    header: 'Descripción',
  },
  {
    accessorKey: 'imagenes',
    header: 'Imágenes',
    // Display number of images in the cell
    cell: ({ row }) => {
      const producto = row.original;
      return producto.imagenes.length;
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const producto = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='ghost' className='h-8 w-8 p-0'>
              <span className='sr-only'>Abrir menú</span>
              <MoreHorizontal className='h-4 w-4' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            <DropdownMenuLabel>Acciones</DropdownMenuLabel>
            <DropdownMenuItem
            //   onClick={() => navigator.clipboard.writeText(pedido.numero_de_orden.toString())}
            >
              Modificar Producto
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
