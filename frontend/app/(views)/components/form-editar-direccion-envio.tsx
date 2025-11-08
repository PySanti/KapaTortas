"use client";

import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/app/(views)/components/ui/button";
import { Input } from "@/app/(views)/components/ui/input";
import { Checkbox } from "@/app/(views)/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/app/(views)/components/ui/form";
import { useForm } from "react-hook-form";
import {
  DireccionEnvioSchema,
  DireccionEnvioType,
} from "@/app/controladores/lib/validations/direccion-envio";
import clienteApi from "@/app/controladores/api/cliente-api";
import FormErrorMessage from "./form-error-msg";
import FormSuccessMessage from "./form-success-msg";
import { useRouter } from "next/navigation";
import NominatinAuto from "./directions/nominatin-auto";
import { DireccionEntrega } from "@/app/models/Pedido";

type FormEditarDireccionEnvioProps = {
  email: string;
  direccion: DireccionEntrega;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
};

export default function FormEditarDireccionEnvio({
  email,
  direccion,
  isOpen,
  setIsOpen,
}: FormEditarDireccionEnvioProps) {
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [successMsg, setSuccessMsg] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isPreferred, setIsPreferred] = useState<boolean>(direccion.is_favorite || false);

  const router = useRouter();

  const form = useForm<DireccionEnvioType>({
    resolver: zodResolver(DireccionEnvioSchema),
    defaultValues: {
      direccion: direccion.direccion || "",
      referencia: direccion.referencia || "",
      ciudad: direccion.ciudad || "",
      estado: direccion.estado || "",
      // @ts-ignore (Zod coerce string to number)
      codigo_postal: direccion.codigo_postal?.toString() || "",
    },
    mode: "onChange",
  });

  // Reset form when dialog opens/closes or direccion changes
  useEffect(() => {
    if (isOpen && direccion) {
      form.reset({
        direccion: direccion.direccion || "",
        referencia: direccion.referencia || "",
        ciudad: direccion.ciudad || "",
        estado: direccion.estado || "",
        codigo_postal: direccion.codigo_postal?.toString() || "",
      });
      setIsPreferred(direccion.is_favorite || false);
      setErrorMsg("");
      setSuccessMsg("");
      setIsLoading(false);
    }
  }, [isOpen, direccion, form]);

  const {
    handleSubmit,
    formState: { errors },
  } = form;

  const onSubmit = async (data: DireccionEnvioType) => {
    try {
      setIsLoading(true);
      setErrorMsg("");
      setSuccessMsg("");

      // Edit the address
      const editResponse = await clienteApi.editarDireccionEnvio(
        direccion.id,
        "VENEZUELA", // pais
        data.ciudad,
        data.estado,
        data.direccion,
        data.referencia,
        parseInt(data.codigo_postal),
      );

      if (!editResponse.ok) {
        const errorData = await editResponse.json().catch(() => ({}));
        setErrorMsg(errorData.error || "Error al editar dirección");
        setIsLoading(false);
        return;
      }

      // Set or clear preferred address based on checkbox
      const wasPreferred = direccion.is_favorite || false;
      if (isPreferred !== wasPreferred) {
        const preferredResponse = await clienteApi.establecerDireccionPreferida(
          email,
          isPreferred ? direccion.id : null,
        );

        if (!preferredResponse.ok) {
          const errorData = await preferredResponse.json().catch(() => ({}));
          setErrorMsg(errorData.error || "Error al establecer dirección preferida");
          setIsLoading(false);
          return;
        }
      }

      setSuccessMsg("Dirección editada correctamente");
      setErrorMsg("");

      // Close dialog and refresh after delay
      setTimeout(() => {
        setIsLoading(false);
        setIsOpen(false);
        router.refresh(); // Refresh page cuando se edita una dirección
      }, 1500);
    } catch (error) {
      console.error("Error al editar dirección:", error);
      setErrorMsg("Error al editar dirección. Por favor, intenta de nuevo.");
      setSuccessMsg("");
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="flex space-x-4">
          <FormField
            control={form.control}
            name="direccion"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Dirección</FormLabel>
                <NominatinAuto 
                    value={field.value}
                    onChange={field.onChange}
                    onSelect={(suggestion) => {
                      // Extract data from suggestion and update the form
                      if (suggestion) {
                        // Update direccion field
                        if (suggestion.display_name || suggestion.name) {
                          form.setValue("direccion", suggestion.display_name || suggestion.name);
                        }
                        // Update ciudad from address details
                        if (suggestion.address?.city) {
                          form.setValue("ciudad", suggestion.address.city);
                        } else if (suggestion.address?.town) {
                          form.setValue("ciudad", suggestion.address.town);
                        } else if (suggestion.address?.municipality) {
                          form.setValue("ciudad", suggestion.address.municipality);
                        }
                        // Update estado from address details
                        if (suggestion.address?.state) {
                          form.setValue("estado", suggestion.address.state);
                        }
                        // Update postal code if available
                        if (suggestion.address?.postcode) {
                          form.setValue("codigo_postal", suggestion.address.postcode);
                        }
                      }
                    }} 
                  />
                <FormMessage className="text-[0.8rem]" />
              </FormItem>
            )}
          />
        </div>
        <div className="flex space-x-4">
          <FormField
            control={form.control}
            name="ciudad"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Ciudad</FormLabel>
                <FormControl>
                  <Input placeholder="Ciudad" {...field} />
                </FormControl>
                <FormMessage className="text-[0.8rem]" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="estado"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Estado</FormLabel>
                <FormControl>
                  <Input placeholder="Estado" {...field} />
                </FormControl>
                <FormMessage className="text-[0.8rem]" />
              </FormItem>
            )}
          />
        </div>
        <div className="flex space-x-4">
          <FormField
            control={form.control}
            name="referencia"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Referencia</FormLabel>
                <FormControl>
                  <Input placeholder="Referencia" {...field} />
                </FormControl>
                <FormMessage className="text-[0.8rem]" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="codigo_postal"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Código Postal</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="Código Postal" {...field} />
                </FormControl>
                <FormMessage className="text-[0.8rem]" />
              </FormItem>
            )}
          />
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="preferred"
            checked={isPreferred}
            onCheckedChange={(checked) => setIsPreferred(checked === true)}
          />
          <label
            htmlFor="preferred"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Establecer como dirección preferida
          </label>
        </div>
        <FormErrorMessage message={errorMsg} />
        <FormSuccessMessage message={successMsg} />
        <div className="flex justify-end">
          <Button type="submit" disabled={isLoading} variant={"terciary"}>
            Guardar Cambios
          </Button>
        </div>
      </form>
    </Form>
  );
}

