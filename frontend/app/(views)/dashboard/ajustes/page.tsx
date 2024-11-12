import { Perfil } from '@/app/models/Perfil';
import DashboardCard from '../../components/dashboard-card';
import DashboardContainer from '../../components/dashboard-container';
import { DashboardHeader } from '../../components/dashboard-header';
import { Rol } from '@/app/models/RolEnum';

const usuario: Perfil = {
  id: 1,
  nombre_completo: 'Samuel Palacios',
  correo: 'samuelpl0888@gmail.com',

  contraseña: '123456',
  numero_telefonico: '123456',
  fecha_nacimiento: '12/12/2000',
  link_foto: 'https://www.google.com',
  rol: Rol.CLIENTE,
  stripeCustomerId: '123',
  is_active: true,
  is_staff: false,
};

export default function PagosPage() {
  return (
    <DashboardContainer>
      <DashboardHeader heading='Datos Personales' description='Actualiza tu información personal' />
      {usuario && (
        <>
          <DashboardCard title='Información Personal' editable>
            <p className='p-secondary'>{usuario.nombre_completo}</p>
          </DashboardCard>
          <DashboardCard title='Correo' editable>
            <p className='p-secondary'>{usuario.correo}</p>
          </DashboardCard>
          <DashboardCard title='Contraseña' editable>
            <p className='p-secondary'>********</p>
          </DashboardCard>
        </>
      )}
    </DashboardContainer>
  );
}
