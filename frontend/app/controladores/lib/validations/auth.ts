import { z } from 'zod';

export const registroSchema = z
  .object({
    nombre: z
      .string()
      .min(5, { message: 'El nombre debe tener al menos 5 caractéres' })
      .max(50, { message: 'El nombre no puede tener más de 50 caractéres' })
      .transform((value) => value.replace(/\s+/g, ' ')) // Normalize multiple spaces to one
      .refine((value) => /^[A-Za-zÑñÁÉÍÓÚáéíóú]+ [A-Za-zÑñÁÉÍÓÚáéíóú]+$/.test(value), {
        message: 'Por favor, ingresa nombre y apellido',
      }),
    // .regex(
    //   /^[A-Za-zÑñÁÉÍÓÚáéíóú]+ [A-Za-zÑñÁÉÍÓÚáéíóú]+$/,
    //   'Por favor, ingresa nombre y apellido'
    // )
    // .transform((value) => value.trim().replace(/\s+/g, ' ')), // Quita espacios redundantes
    email: z.string().email({ message: 'Por favor, ingresa un email válido' }),
    password: z.string().min(6, { message: 'La contraseña debe tener al menos 6 caractéres' }),
    confirmPassword: z
      .string()
      .min(6, { message: 'La contraseña debe tener al menos 6 caracteres' }),
    rol: z.enum(['cliente', 'empleado', 'admin']).optional(),
    cedula: z.string().regex(/^[VE]-?\d{7,8}$/, {
      message: 'La cédula debe comenzar con V o E y tener 7 u 8 dígitos',
    }),
  })
  .refine(
    (form) => {
      return form.confirmPassword === form.password;
    },
    {
      message: 'Las contraseñas no coinciden',
      path: ['confirmPassword'],
    }
  );

export type registroType = z.infer<typeof registroSchema>;

export const loginSchema = z.object({
  email: z.string().email({ message: 'Por favor, ingresa un email válido' }),
  password: z.string().min(6, { message: 'La contraseña debe tener al menos 6 caractéres' }),
});

export type loginType = z.infer<typeof loginSchema>;

// export const resetPasswordSchema = z.object({
//   email: z.string().email({ message: 'Please enter a valid email address' }),
// });

// export type resetPasswordType = z.infer<typeof resetPasswordSchema>;

// export const newPasswordSchema = z
//   .object({
//     password: z.string().min(8, { message: 'Password must be at least 8 characters long' }),
//     confirmPassword: z.string().min(8, { message: 'Password must be at least 8 characters long' }),
//   })
//   .refine(
//     (form) => {
//       return form.confirmPassword === form.password;
//     },
//     {
//       message: 'Passwords do not match',
//       path: ['confirmPassword'],
//     }
//   );

// export type newPasswordType = z.infer<typeof newPasswordSchema>;
