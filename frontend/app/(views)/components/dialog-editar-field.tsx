"use client";

import { Button } from "@/app/(views)/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/app/(views)/components/ui/dialog";
import { Input } from "@/app/(views)/components/ui/input";
import { Label } from "@/app/(views)/components/ui/label";
import ClienteAPI from "@/app/controladores/api/users/ClienteAPI";

type Field = {
  id: string;
  label: string;
  placeholder?: string; // Use placeholder for input value
};

type DialogEditarProps = {
  title: string;
  triggerText: string;
  fields: Field[];
  email: string; // Assuming we have the email of the client as a prop
};

export function DialogEditar({ title, triggerText, fields, email }: DialogEditarProps) {
  // This function will be called on form submission
  async function handleSubmit() {
    try {
      const formValues: { [key: string]: string } = {}; // Define formValues with a type allowing string keys

      // Collect all form values
      fields.forEach((field) => {
        const inputElement = document.getElementById(field.id) as HTMLInputElement;
        formValues[field.id] = inputElement?.value || "";
      });

      // Call ClienteAPI's actualizarInfoCliente method
      const updatedProfile = await ClienteAPI.actualizarInfoCliente(
        email,
        formValues["name"], // Access name value
        formValues["email"], // Access email value
        formValues["password"] // Access password value
      );

      if (updatedProfile) {
        console.log("Cliente actualizado exitosamente:", updatedProfile);
      } else {
        console.error("No se pudo actualizar el perfil.");
      }
    } catch (error) {
      console.error("Error al actualizar los datos:", error);
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">{triggerText}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-terciary">{title}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {fields.map((field) => (
            <div key={field.id} className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor={field.id} className="text-right">
                {field.label}
              </Label>
              <Input
                id={field.id}
                placeholder={field.placeholder} // Set placeholder from field prop
                className="col-span-3 text-terciary"
              />
            </div>
          ))}
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleSubmit}>
            Guardar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
