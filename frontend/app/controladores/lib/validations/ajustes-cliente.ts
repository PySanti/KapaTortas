import { z } from 'zod';

export const ajustesClienteSchema = z.object({
  new_email: z
    .string()
    .email({ message: 'Por favor, ingresa un email válido' })
    .nullable()
    .optional(),
  new_nombre_completo: z
    .string()
    .min(5, { message: 'Por favor, ingresa nombre y apellido' })
    .regex(/^[^0-9]+$/, { message: 'El nombre no puede tener números' })
    .nullable()
    .optional(),
  new_password: z
    .string()
    .min(6, { message: 'La contraseña debe tener al menos 6 caractéres' })
    .nullable()
    .optional(),
  new_numero_telefonico: z
    .string()
    // .min(11, { message: 'El número debe tener al menos 11 caracteres' })
    // .max(11, { message: 'El número no puede exceder los 11 caracteres' })
    .regex(/^(0424|0414|0412|0416|0426)\d{7}$/, {
      message: 'Por favor, ingresa un número de teléfono válido',
    })
    .nullable()
    .optional(),
  new_fecha_nacimiento: z.string().nullable().optional(),
});
