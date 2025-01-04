import CajaPage from "./caja-page";
import { auth } from "@/auth";
import ClienteAPI from "@/app/controladores/api/cliente-api";

export default async function PedidoServerPage() {
  const session = await auth();

  const direcciones = await ClienteAPI.obtenerDireccionesEnvio(
    session?.user?.email || "",
  );
  return <CajaPage direcciones={direcciones} />;
}
