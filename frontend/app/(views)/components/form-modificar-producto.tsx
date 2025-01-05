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
  ModificarProductoAPIType,
  ModificarProductoFormSchema,
  ModificarProductoFormType,
} from "@/app/controladores/lib/validations/modificar-producto";
import ProductoAPI from "@/app/controladores/api/ProductoAPI";
import FormErrorMessage from "./form-error-msg";
import FormSuccessMessage from "./form-success-msg";
import { Categoria } from "@/app/models/Producto";
import { SelectCategorias } from "./select-categorias";

type FormModificarProductoProps = {
  id: number;
  productData: ModificarProductoFormType;
  handleCloseDialog: () => void;
};

const categorias = [
  { label: "Postre", value: Categoria.POSTRE },
  { label: "Especial", value: Categoria.ESPECIAL },
  { label: "Extra", value: Categoria.EXTRA },
];

export default function FormModificarProducto({
  id,
  productData,
  handleCloseDialog,
}: FormModificarProductoProps) {
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [successMsg, setSuccessMsg] = useState<string>("");

  const form = useForm<ModificarProductoFormType>({
    resolver: zodResolver(ModificarProductoFormSchema),
    defaultValues: {
      new_titulo: productData.new_titulo,
      new_descripcion: productData.new_descripcion,
      new_categoria: productData.new_categoria,
      // En el columns de dashborad-empleado/productos estoy transformando el array a string separado por comas
      new_imagenes: productData.new_imagenes,
    },
    mode: "onChange",
  });

  const {
    handleSubmit,
    formState: { errors },
  } = form;

  const onSubmit = async (data: ModificarProductoFormType) => {
    const formattedData: ModificarProductoAPIType = {
      ...data,
      // Transformar el string de URLs a un array de URLs (como estaba originalmente)
      new_imagenes: data.new_imagenes.split(",").map((url) => url.trim()),
    };

    try {
      const res = await ProductoAPI.modificarProductoById(id, formattedData);

      // If res is null (catch) handle the error
      if (res === null) {
        setErrorMsg("Error al modificar el producto");
        setSuccessMsg("");
      } else {
        setSuccessMsg("Producto actualizado exitosamente");
        setErrorMsg("");

        setTimeout(() => {
          handleCloseDialog();
        }, 2000);
      }
    } catch (error) {
      console.log("Error al modificar el producto:", error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="flex space-x-4">
          <FormField
            control={form.control}
            name="new_titulo"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Nombre</FormLabel>
                <FormControl>
                  <Input placeholder="Nombre" {...field} />
                </FormControl>
                <FormMessage className="text-[0.8rem]" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="new_descripcion"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Descripción</FormLabel>
                <FormControl>
                  <Input placeholder="Descripción" {...field} />
                </FormControl>
                <FormMessage className="text-[0.8rem]" />
              </FormItem>
            )}
          />
        </div>
        <div className="flex space-x-4">
          <FormField
            control={form.control}
            name="new_imagenes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Imágenes URLs</FormLabel>
                <FormControl>
                  <Input placeholder="URL1, URL2, URL3" {...field} />
                </FormControl>
                <FormMessage className="text-[0.8rem]" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="new_categoria"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Categoría</FormLabel>
                <FormControl>
                  <SelectCategorias
                    value={field.value}
                    placeholder="Selecciona una categoría"
                    options={categorias}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormMessage className="text-[0.8rem]" />
              </FormItem>
            )}
          />
        </div>

        <FormErrorMessage message={errorMsg} />
        <FormSuccessMessage message={successMsg} />
        <div className="flex justify-end">
          <Button type="submit" variant={"terciary"}>
            Modificar Producto
          </Button>
        </div>
      </form>
    </Form>
  );
}
