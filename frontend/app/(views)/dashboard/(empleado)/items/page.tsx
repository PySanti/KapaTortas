import DashboardContainer from '@/app/(views)/components/dashboard-container';
import { DataTableProductos } from '@/app/(views)/components/dashboard-empleado/productos/data-table';
import { columnsProductos } from '@/app/(views)/components/dashboard-empleado/productos/columns';
import { DashboardHeader } from '@/app/(views)/components/dashboard-header';
import ProductoAPI from '@/app/controladores/api/ProductoAPI';
import { auth } from '@/auth';
import { Rol } from '@/app/models/RolEnum';

export default async function ProductosPage() {
  const session = await auth();
  const productos = await ProductoAPI.obtenerListaProductos();
  console.log(productos);

  return (
    <DashboardContainer>
      {session?.user && session?.user.rol !== Rol.CLIENTE ? (
        <>
          <DashboardHeader heading='Productos' description='Revisa los productos del negocio' />
          <DataTableProductos columns={columnsProductos} data={productos!} />
        </>
      ) : (
        <DashboardHeader heading='No estás autorizado para ver esta página' />
      )}
    </DashboardContainer>
  );
}
