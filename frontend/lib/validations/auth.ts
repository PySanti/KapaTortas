import { z } from 'zod';

export const registroSchema = z
  .object({
    nombre: z
      .string()
      .min(5, { message: 'Por favor, ingresar nombre y apellido' })
      .regex(/^[^0-9]+$/, { message: 'Nombre completo no puede contener números.' }),
    email: z.string().email({ message: 'Por favor, ingresar un email válido' }),
    password: z.string().min(6, { message: 'La contraseña debe tener al menos 6 caractéres' }),
    confirmPassword: z
      .string()
      .min(6, { message: 'La contraseña debe tener al menos 6 caracteres' }),
    rol: z.enum(['cliente', 'empleado', 'admin']).optional(),
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
  email: z.string().email({ message: 'Por favor, ingresar un email válido' }),
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
