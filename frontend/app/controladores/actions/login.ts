'use server';

import { loginSchema, loginType } from '@/app/controladores/lib/validations/auth';
import { signIn } from '@/auth';
import { defaultLoginRedirectCliente, defaultLoginRedirectEmpleado } from '@/app/models/config/routes';
import { AuthError } from 'next-auth';
import ClienteAPI from '../api/cliente-api';
import { Rol } from '@/app/models/RolEnum';

export const login = async (data: loginType) => {
  const validatedData = loginSchema.safeParse(data);

  if (!validatedData.success) {
    return { error: 'Invalid fields' };
  }

  const { email, password } = validatedData.data;

  const existingUser = await ClienteAPI.obtenerCliente(email);

  if (!existingUser || !existingUser.perfil) {
    return null;
  }

  const { perfil: user } = existingUser;

  // If the user does not exist, return an error
  if (!user.correo || !user.contraseña) {
    return { error: 'Correo no existe' };
  }

  if (!user.is_active) {
    return { error: 'Revisa tu correo para activar tu cuenta' };
  }

  try {
   if(user.rol === Rol.CLIENTE) {
    await signIn('credentials', {
      email: data.email,
      password: data.password,
        redirectTo: defaultLoginRedirectCliente,
      });
    } else {
      await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirectTo: defaultLoginRedirectEmpleado,
      });
    }

    return { success: 'Inicio de sesión exitoso' };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin': {
          return {
            error: 'Correo o contraseña incorrectos',
            email: `${data.email}`,
            password: `${data.password}`,
          };
        }
        default:
          return {
            error: 'Error al iniciar sesión',
            email: `${data.email}`,
            password: `${data.password}`,
          };
      }
    }

    throw error;
  }
};
