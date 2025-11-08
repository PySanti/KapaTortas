"use client";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/app/(views)/components/ui/dialog";
import FormEditarDireccionEnvio from "@/app/(views)/components/form-editar-direccion-envio";
import { Separator } from "@/app/(views)/components/ui/separator";
import { DireccionEntrega } from "@/app/models/Pedido";

type DialogEditarDireccionProps = {
  email: string;
  direccion: DireccionEntrega;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
};

export default function DialogEditarDireccion({
  email,
  direccion,
  isOpen,
  setIsOpen,
}: DialogEditarDireccionProps) {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[620px]">
        <DialogHeader className="gap-y-2">
          <DialogTitle className="text-2xl text-terciary">Editar dirección</DialogTitle>
          <Separator />
        </DialogHeader>
        <FormEditarDireccionEnvio
          email={email}
          direccion={direccion}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
        />
      </DialogContent>
    </Dialog>
  );
}

