import DashboardContainer from '@/app/(views)/components/dashboard-container';
import { columnsVentas } from '@/app/(views)/components/dashboard-empleado/ventas/columns';
import { DataTableVentas } from '@/app/(views)/components/dashboard-empleado/ventas/data-table';
import { DashboardHeader } from '@/app/(views)/components/dashboard-header';
import pedidoApi from '@/app/controladores/api/pedido-api';
import { Rol } from '@/app/models/RolEnum';
import { auth } from '@/auth';

export default async function VentasPage() {
  const session = await auth();
  const ventas = await pedidoApi.obtenerVentas();
  console.log(ventas);

  return (
    <DashboardContainer>
      {session?.user && session?.user.rol !== Rol.CLIENTE ? (
        <>
          <DashboardHeader heading='Ventas' description='Revisa las ventas del negocio' />
          <DataTableVentas columns={columnsVentas} data={ventas!} />
        </>
      ) : (
        <DashboardHeader heading='No estás autorizado para ver esta página' />
      )}
    </DashboardContainer>
  );
}
