import DashboardContainer from '@/app/(views)/components/dashboard-container';
import { columnsVentas } from '@/app/(views)/components/dashboard-empleado/ventas/columns';
import { DataTableVentas } from '@/app/(views)/components/dashboard-empleado/ventas/data-table';
import { DashboardHeader } from '@/app/(views)/components/dashboard-header';
import pedidoApi from '@/app/controladores/api/pedido-api';

export default async function VentasPage() {
  const ventas = await pedidoApi.obtenerVentas();
  console.log(ventas);

  return (
    <DashboardContainer>
      <DashboardHeader heading='Ventas' description='Revisa las ventas del negocio' />
      <DataTableVentas columns={columnsVentas} data={ventas!} />
    </DashboardContainer>
  );
}
