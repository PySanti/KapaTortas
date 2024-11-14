import { Pedido } from "@/app/models/Pedido";
import { Cliente } from "@/app/models/Cliente";
import MainPedido from "../../components/main-pedido";
import { auth } from "@/auth";
import ClienteAPI from "@/app/controladores/api/users/ClienteAPI";
import { Rol } from "@/app/models/RolEnum";


export default async function PedidoPage() {
  // Session user
  const session = await auth();
  const perfil = await ClienteAPI.obtenerCliente(session?.user.email!);

  return (
    <div>
      <MainPedido perfil={perfil} />
    </div>
  );
}
