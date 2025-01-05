"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/app/(views)/components/ui/dialog";
import { Button } from "@/app/(views)/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/app/(views)/components/ui/dropdown-menu";
import { Separator } from "@/app/(views)/components/ui/separator";
import FormModificarProducto from "./form-modificar-producto";
import { MoreHorizontal } from "lucide-react";
import { ModificarProductoType } from "@/app/controladores/lib/validations/modificar-producto";

type DialogModificarProductoByIdProps = {
  productoId: number;
  productData: ModificarProductoType;
};

export function DialogModificarProductoById({
  productoId,
  productData,
}: DialogModificarProductoByIdProps) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Abrir menú</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Acciones</DropdownMenuLabel>
          <DropdownMenuItem>
            <DialogTrigger asChild>
              <Button variant="ghost">Modificar Producto</Button>
            </DialogTrigger>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DialogContent className="sm:max-w-[620px]">
        <DialogHeader className="gap-y-2">
          <DialogTitle className="text-2xl text-terciary">Modificar Producto</DialogTitle>
          <Separator />
        </DialogHeader>
        <FormModificarProducto
          id={productoId}
          productData={productData}
          handleCloseDialog={() => setIsOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
