import { z } from "zod";
import { Categoria } from "@/app/models/Producto";

export const ModificarProductoFormSchema = z.object({
  new_titulo: z.string().min(3, { message: "Por favor, introduce un título válido" }),
  new_descripcion: z.string().min(3, { message: "Por favor, introduce una descripción válida" }),

  new_categoria: z.nativeEnum(Categoria, {
    message: "Por favor, selecciona una categoría válida",
  }),
  // This is the version for the form, the imagenes are converted to a string separated by commas
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
  // This is the version for the API submission, the imagenes are an array of strings
  new_imagenes: z.array(z.string().url()),
});

export type ModificarProductoAPIType = z.infer<typeof ModificarProductoAPISchema>;
