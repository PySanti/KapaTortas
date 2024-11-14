import { Pedido } from "@/app/models/Pedido";
import MainPedido from "../../components/main-pedido";
import { auth } from "@/auth";



export default async function PedidoPage() {
  // Session user
  const perfil = await auth();

    return (
        <div>
            <MainPedido perfil={perfil} />
        </div>
    )
}