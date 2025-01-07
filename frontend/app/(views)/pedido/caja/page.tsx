import CajaPage from "./caja-page";
import { auth } from "@/auth";
import ClienteAPI from "@/app/controladores/api/cliente-api";
import { Rol } from "@/app/models/RolEnum";

export default async function PedidoServerPage() {
  // Fetch the session to get the user info
  const session = await auth();

  // Check if the user is authenticated and has the role 'CLIENTE'
  if (session?.user?.rol === Rol.ADMIN || session?.user?.rol === Rol.EMPLEADO) {
    return (
      <div className="p-8">
        <h2 className="text-terciary">Error de Acceso</h2>
        <p className="text-lg">
          No puedes hacer un pedido ya que tienes cuenta de empleado.
        </p>
      </div>
    );
  }

  // Fetch direcciones only if the user is 'CLIENTE'
  const direcciones = await ClienteAPI.obtenerDireccionesEnvio(
    session?.user.email || "",
  );

  return <CajaPage direcciones={direcciones} />;
}
