import { z } from "zod";

export const direccionSchema = z.object({
  direccion: z.string().min(3, { message: "Por favor, ingresa una dirección válida" }),
  referencia: z.string().min(3, { message: "Por favor, ingresa una referencia válida" }),
  codigo_postal: z.coerce.number().min(3, { message: "Por favor, ingresa un código postal válido" }),
  nota: z.string().optional(),
});

// Direccion type
export type DireccionFormData = z.infer<typeof direccionSchema>;
