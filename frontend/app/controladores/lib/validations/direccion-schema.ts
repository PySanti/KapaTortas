import { z } from "zod";

export const direccionSchema = z.object({
  direccion: z.string().min(1, "La dirección es requerida"),
  referencia: z.string().min(1, "La referencia es requerida"),
  codigo_postal: z
    .string()
    .min(1, "El código postal es requerido")
    .transform((val) => parseInt(val, 10))
    .refine((val) => !isNaN(val) && val >= 999 && val <= 99999, {
      message: "Código postal inválido",
    }),
  nota: z.string().optional(),
});

// Direccion type
export type DireccionFormData = z.infer<typeof direccionSchema>;
