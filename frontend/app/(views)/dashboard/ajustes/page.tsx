import { Perfil } from '@/app/models/Perfil';
import DashboardCard from '../../components/dashboard-card';
import DashboardContainer from '../../components/dashboard-container';
import { DashboardHeader } from '../../components/dashboard-header';
import { Rol } from '@/app/models/RolEnum';

import { auth } from '@/auth';

export default async function PagosPage() {
  const session = await auth();

  return (
    <DashboardContainer>
      <DashboardHeader heading='Datos Personales' />
      {session?.user && (
        <>
          <DashboardCard title='Información Personal' editable>
            <p>{session?.user?.name}</p>
          </DashboardCard>
          <DashboardCard title='Correo' editable>
            <p>{session?.user?.email}</p>
          </DashboardCard>
          <DashboardCard title='Contraseña' editable>
            <p>********</p>
          </DashboardCard>
        </>
      )}
    </DashboardContainer>
  );
}
