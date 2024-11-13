import { Pedido } from "@/app/models/Pedido";
import MainPedido from "../../components/main-pedido";
import PedidoAPI from "@/app/controladores/api/pedido-api";


export default async function PedidoPage() {
    return (
        <div>
            <MainPedido />
        </div>
    )
}