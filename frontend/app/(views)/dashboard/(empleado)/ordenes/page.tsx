import DashboardContainer from "@/app/(views)/components/dashboard-container";
import { DashboardHeader } from "@/app/(views)/components/dashboard-header";
import { DataTablePedidos } from "@/app/(views)/components/dashboard-empleado/pedidos/data-table";
import { columnsPedidos } from "@/app/(views)/components/dashboard-empleado/pedidos/columns";
import pedidoApi from "@/app/controladores/api/pedido-api";
import { auth } from "@/auth";
import { Rol } from "@/app/models/RolEnum";


export default async function PedidosPage() {
  const session = await auth();
  const pedidos = await pedidoApi.obtenerPedidos();
  console.log(pedidos);

  return (
    <DashboardContainer>
      {session?.user && session?.user.rol !== Rol.CLIENTE ? (
        <>
          <DashboardHeader heading="Pedidos" description="Revisa los pedidos del negocio" />
          <DataTablePedidos columns={columnsPedidos} data={pedidos!} />
        </>
      ) : (
        <DashboardHeader heading="No estás autorizado para ver esta página" />
      )}
    </DashboardContainer>
  );
}
