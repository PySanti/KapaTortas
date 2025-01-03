"use client";

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

export default function FormAgregarDireccionEnvio() {
  const form = useForm<DireccionEnvioType>({
    resolver: zodResolver(DireccionEnvioSchema),
    defaultValues: {
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
    // Handle form submission logic here
    console.log(data);
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
        <div className="flex justify-end">
          <Button type="submit" variant={"terciary"}>
            Agregar Dirección
          </Button>
        </div>
      </form>
    </Form>
  );
}
