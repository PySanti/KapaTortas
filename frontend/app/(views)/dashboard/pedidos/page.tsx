import { auth } from '@/auth';
import DashboardContainer from '../../components/dashboard-container';
import { DashboardHeader } from '../../components/dashboard-header';
import PedidoHistorial from '../../components/pedido-historial';
import PedidoAPI from '@/app/controladores/api/pedido-api';

export default async function OrdenesPage() {
  const session = await auth();

  const pedidos = await PedidoAPI.obtenerPedidosCliente(session?.user.email!);
  console.log(pedidos);

  return (
    <DashboardContainer>
      <DashboardHeader
        heading='Pedidos'
        description='Revisa el estado de tus pedidos y realiza cambios si es necesario'
      />
      <PedidoHistorial pedidos={pedidos!} nombreUsuario={session?.user.name!} />
    </DashboardContainer>
  );
}
