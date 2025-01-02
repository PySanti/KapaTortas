import DashboardContainer from '@/app/(views)/components/dashboard-container';
import { DashboardHeader } from '@/app/(views)/components/dashboard-header';
import pedidoApi from '@/app/controladores/api/pedido-api';

export default async function PedidosPage() {
  const pedidos = await pedidoApi.obtenerPedidos();
  console.log(pedidos);

  return (
    <DashboardContainer>
      <DashboardHeader
        heading='Pedidos'
        description='Revisa el estado de tus pedidos y realiza cambios si es necesario'
      />
    </DashboardContainer>
  );
}
