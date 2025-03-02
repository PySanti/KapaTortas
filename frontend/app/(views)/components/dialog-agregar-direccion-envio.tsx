"use client";
import { useState } from "react";
import { Button } from "@/app/(views)/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/app/(views)/components/ui/dialog";
import FormAgregarDireccionEnvio from "@/app/(views)/components/form-agregar-direccion-envio";
import { Separator } from "@/app/(views)/components/ui/separator";

type DialogAgregarDireccionEnvioProps = {
  email: string;
  isOpen?: boolean;
  setIsOpen?: (isOpen: boolean) => void;
  onDireccionCreada?: () => void;
};

export function DialogAgregarDireccionEnvio({
  email,
  isOpen = false,
  setIsOpen = () => {},
  onDireccionCreada,
}: DialogAgregarDireccionEnvioProps) {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Agregar Dirección</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[620px]">
        <DialogHeader className="gap-y-2">
          <DialogTitle className="text-2xl text-terciary">Agregar nueva dirección</DialogTitle>
          <Separator />
        </DialogHeader>
        <FormAgregarDireccionEnvio
          email={email}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          onDireccionCreada={onDireccionCreada}
        />
        {/* <DialogFooter>
        </DialogFooter> */}
      </DialogContent>
    </Dialog>
  );
}

export default DialogAgregarDireccionEnvio;
