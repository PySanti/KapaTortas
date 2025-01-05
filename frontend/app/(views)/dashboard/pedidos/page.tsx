import { auth } from "@/auth";
import DashboardContainer from "../../components/dashboard-container";
import { DashboardHeader } from "../../components/dashboard-header";
import PedidoHistorial from "../../components/pedido-historial";
import PedidoAPI from "@/app/controladores/api/pedido-api";
import { Rol } from "@/app/models/RolEnum";

export default async function OrdenesPage() {
  const session = await auth();

  const pedidos = await PedidoAPI.obtenerPedidosCliente(session?.user.email!);
  console.log(pedidos);

  return (
    <DashboardContainer>
      {session?.user && session?.user.rol === Rol.CLIENTE ? (
        <>
          <DashboardHeader
            heading="Pedidos"
            description="Revisa el estado de tus pedidos y realiza cambios si es necesario"
          />
          <PedidoHistorial
            pedidos={pedidos!}
            nombreUsuario={session?.user.name!}
          />
        </>
      ) : (
        <DashboardHeader heading="No estás autorizado para ver esta página" />
      )}
    </DashboardContainer>
  );
}
