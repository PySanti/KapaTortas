import { z } from "zod";
import { Categoria } from "@/app/models/Producto";

export const ModificarProductoFormSchema = z.object({
  new_titulo: z.string().min(3, { message: "Por favor, introduce un título válido" }),
  new_descripcion: z.string().min(3, { message: "Por favor, introduce una descripción válida" }),

  new_categoria: z.nativeEnum(Categoria, {
    message: "Por favor, selecciona una categoría válida",
  }),

  new_imagenes: z
    .string()
    .refine(
      (val) => val.split(",").every((url) => z.string().url().safeParse(url.trim()).success),
      {
        message: "Por favor, introduce URLs válidas separadas por comas",
      }
    ),
});

export type ModificarProductoFormType = z.infer<typeof ModificarProductoFormSchema>;

// Schema for the API submission (array)
export const ModificarProductoAPISchema = z.object({
  new_titulo: z.string().min(1, "El título es requerido"),
  new_descripcion: z.string().min(1, "La descripción es requerida"),
  new_categoria: z.nativeEnum(Categoria),
  new_imagenes: z.array(z.string().url()),
});

export type ModificarProductoAPIType = z.infer<typeof ModificarProductoAPISchema>;
