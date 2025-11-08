import DashboardContainer from "../../components/dashboard-container";
import { DashboardHeader } from "../../components/dashboard-header";
import { auth } from "@/auth";
import ClienteAPI from "@/app/controladores/api/cliente-api";
import { Rol } from "@/app/models/RolEnum";
import DialogAgregarDireccion from "../../components/dialog-agregar-direccion-envio";
import DireccionCard from "../../components/direccion-card";

export default async function DireccionesPage() {
  const session = await auth();

  const direcciones = await ClienteAPI.obtenerDireccionesEnvio(session?.user.email!);

  // Sort addresses: preferred address first
  const direccionesOrdenadas = direcciones
    ? [...direcciones].sort((a, b) => {
        // Preferred addresses (is_favorite === true) come first
        if (a.is_favorite && !b.is_favorite) return -1;
        if (!a.is_favorite && b.is_favorite) return 1;
        return 0; // Keep original order for non-preferred addresses
      })
    : null;

  return (
    <DashboardContainer>
      {session?.user && session?.user.rol === Rol.CLIENTE ? (
        <>
          <DashboardHeader
            heading="Direcciones"
            description="Agrega direcciones de envío para que tus pedidos lleguen a donde estés"
          />
          <DialogAgregarDireccion email={session?.user.email!} />

          {direccionesOrdenadas && direccionesOrdenadas.length > 0 ? (
            direccionesOrdenadas.map((direccion) => (
              <DireccionCard
                key={direccion.id}
                direccion={direccion}
                userName={session?.user.name || ""}
                email={session?.user.email!}
              />
            ))
          ) : (
            <p>No se encontraron direcciones registradas.</p>
          )}
        </>
      ) : (
        <DashboardHeader heading="No estás autorizado para ver esta página" />
      )}
    </DashboardContainer>
  );
}
