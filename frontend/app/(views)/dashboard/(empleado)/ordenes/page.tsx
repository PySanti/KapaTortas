import DashboardContainer from '@/app/(views)/components/dashboard-container';
import { DashboardHeader } from '@/app/(views)/components/dashboard-header';
import { DataTablePedidos } from '@/app/(views)/components/dashboard-empleado/pedidos/data-table';
import { columnsPedidos } from '@/app/(views)/components/dashboard-empleado/pedidos/columns';
import pedidoApi from '@/app/controladores/api/pedido-api';

export default async function PedidosPage() {
  const pedidos = await pedidoApi.obtenerPedidos();
  console.log(pedidos);

  return (
    <DashboardContainer>
      <DashboardHeader heading='Pedidos' description='Revisa los pedidos del negocio' />
      <DataTablePedidos columns={columnsPedidos} data={pedidos!} />
    </DashboardContainer>
  );
}
