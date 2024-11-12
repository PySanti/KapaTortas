import ClienteAPI from '../api/users/ClienteAPI';
import conseguirToken from '../utilities/conseguirToken';

export const newVerification = async (token: string) => {
  const tokenExistente = await conseguirToken(token);

  if (!tokenExistente) {
    return {
      error: 'Token no encontrado',
    };
  }

  // En la db se actualiza is_active a true y se elimina el token

  return { success: 'Email verificado' };
};
