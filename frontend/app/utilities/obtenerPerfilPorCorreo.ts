import { Perfil } from '@/app/models/Perfil';
import PerfilAPI from '../controladores/api/users/PerfilAPI';

const obtenerPerfilPorCorreo = async (email: string): Promise<Perfil | null> => {
  try {
    const fetchPerfil = await PerfilAPI.obtenerPerfil(email);
    return fetchPerfil;
  } catch (err) {
    console.error('Error intentando conseguir perfil: ', err);
    return null;
  }
};

export default obtenerPerfilPorCorreo;
