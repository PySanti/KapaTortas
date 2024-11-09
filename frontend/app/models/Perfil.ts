import { RolEnum } from "./RolEnum";

// Este es el modelo del Perfil en el front-end
export interface Perfil {
  nombre_completo: string;
  correo: string;
  numero_telefonico: string;
  fecha_nacimiento: string;
  link_foto: string;
  rol: RolEnum;
  is_active: boolean;
  is_staff: boolean;
}
