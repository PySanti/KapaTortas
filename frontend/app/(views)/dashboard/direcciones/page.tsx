import { DireccionEnvio } from '@/app/models/Cliente';
import DashboardContainer from '../../components/dashboard-container';
import { DashboardHeader } from '../../components/dashboard-header';
import DireccionEnvioCard from '../../components/dashboard-card';
import DashboardCard from '../../components/dashboard-card';
import { auth } from '@/auth';
import ClienteAPI from '@/app/controladores/api/users/ClienteAPI';

export default async function DireccionesPage() {
  const session = await auth();

  const direcciones = await ClienteAPI.obtenerDireccionesEnvio(session?.user.email!);

  return (
    <DashboardContainer>
      <DashboardHeader
        heading='Direcciones'
        description='Edita, elimina o establece una dirección de envío predeterminada'
      />

      {direcciones && direcciones.length > 0 ? (
        direcciones.map((direccion) => (
          <DashboardCard
            key={direccion.id}
            highlight={direccion.is_favorite ? 'Dirección de envío preferida' : undefined}
            editable
            deletable
          >
            <p>{session?.user.name}</p>
            <p>{`${direccion.direccion}, ${direccion.referencia}, ${direccion.ciudad}, ${direccion.estado}, ${direccion.codigo_postal}`}</p>
          </DashboardCard>
        ))
      ) : (
        <p>No se encontraron direcciones registradas.</p>
      )}
    </DashboardContainer>
  );
}
