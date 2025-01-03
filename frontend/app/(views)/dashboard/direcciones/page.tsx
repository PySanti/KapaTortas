import { DireccionEnvio } from "@/app/models/Cliente";
import DashboardContainer from "../../components/dashboard-container";
import { DashboardHeader } from "../../components/dashboard-header";
import DashboardCard from "../../components/dashboard-card";
import { auth } from "@/auth";
import ClienteAPI from "@/app/controladores/api/cliente-api";
import { Rol } from "@/app/models/RolEnum";
import { deleteDireccion } from "@/app/controladores/actions/delete-direccion";
import { editDireccion } from "@/app/controladores/actions/edit-direccion";
import FormAgregarDireccionEnvio from "../../components/form-agregar-direccion-envio";

export default async function DireccionesPage() {
  const session = await auth();

  const direcciones = await ClienteAPI.obtenerDireccionesEnvio(session?.user.email!);

  return (
    <DashboardContainer>
      {session?.user && session?.user.rol === Rol.CLIENTE ? (
        <>
          <DashboardHeader
            heading="Direcciones"
            description="Edita, elimina o establece una dirección de envío predeterminada"
          />

          {direcciones && direcciones.length > 0 ? (
            direcciones.map((direccion) => (
              <DashboardCard
                key={direccion.id}
                badge={direccion.is_favorite ? "Dirección de envío preferida" : undefined}
                idElement={direccion.id}
                actions={{
                  edit: {
                    label: "Editar",
                    action: editDireccion,
                    // form: <FormAgregarDireccionEnvio />,
                  },
                  delete: {
                    action: deleteDireccion,
                  },
                }}
              >
                <p>{session?.user.name}</p>
                <p>{`${direccion.direccion}, ${direccion.referencia}, ${direccion.ciudad}, ${direccion.estado}, ${direccion.codigo_postal}`}</p>
              </DashboardCard>
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
