"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/app/(views)/components/ui/button";
import { Input } from "@/app/(views)/components/ui/input";
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

type FormAgregarDireccionEnvioProps = {
  email: string;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
};

export default function FormAgregarDireccionEnvio({
  email,
  isOpen,
  setIsOpen,
}: FormAgregarDireccionEnvioProps) {
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [successMsg, setSuccessMsg] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const router = useRouter();

  const form = useForm<DireccionEnvioType>({
    resolver: zodResolver(DireccionEnvioSchema),
    defaultValues: {
      // pais: "VENEZUELA",
      ciudad: "",
      estado: "",
      direccion: "",
      referencia: "",
      // @ts-ignore (Zod coerce string to number)
      codigo_postal: "",
    },
    mode: "onChange",
  });

  const {
    handleSubmit,
    formState: { errors },
  } = form;

  const onSubmit = async (data: DireccionEnvioType) => {
    const formData = {
      ...data,
      pais: "VENEZUELA",
      correo_cliente: email,
    };

    try {
      setIsLoading(true);
      // Check if address already exists
      const direccionesCliente = await clienteApi.obtenerDireccionesEnvio(email);

      const existingAddress = direccionesCliente?.find(
        (address) => address.direccion === formData.direccion
      );

      if (existingAddress) {
        setErrorMsg("Esta dirección ya existe");
        setIsLoading(false);
        return;
      }

      const res = await clienteApi.agregarDireccionEnvio(formData);

      if (!res.ok) {
        setErrorMsg("Error al agregar dirección");
        setSuccessMsg("");
        setIsLoading(false);
      } else {
        setSuccessMsg("Dirección agregada correctamente");
        setErrorMsg("");
        setTimeout(() => {
          setIsLoading(false);
          setIsOpen(false);
        }, 2000);
        router.refresh(); // Refresh page cuando se agrega una dirección
        // const responseData: DireccionEnvioType = await res.json(); // Parse the JSON if needed
        // console.log("Dirección agregada:", responseData);
      }
    } catch (error) {
      console.log("Error al agregar dirección:", error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
            name="direccion"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Dirección</FormLabel>
                <FormControl>
                  <Input placeholder="Dirección" {...field} />
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
        <FormErrorMessage message={errorMsg} />
        <FormSuccessMessage message={successMsg} />
        <div className="flex justify-end">
          <Button type="submit" disabled={isLoading} variant={"terciary"}>
            Agregar Dirección
          </Button>
        </div>
      </form>
    </Form>
  );
}
