import { Rol } from './RolEnum';

// Este es el modelo del Perfil en el front-end
export interface Perfil {
  id: number;
  nombre_completo: string;
  correo: string;
  contraseña: string;
  numero_telefonico: string;
  fecha_nacimiento: string;
  link_foto: string;
  rol: Rol;
  stripeCustomerId: string;
  is_active: boolean;
  is_staff: boolean;
  auth_token: string;
}
