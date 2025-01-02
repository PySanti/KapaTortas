import DashboardContainer from '@/app/(views)/components/dashboard-container';
import { DataTableProductos } from '@/app/(views)/components/dashboard-empleado/productos/data-table';
import { columnsProductos } from '@/app/(views)/components/dashboard-empleado/productos/columns';
import { DashboardHeader } from '@/app/(views)/components/dashboard-header';
import ProductoAPI from '@/app/controladores/api/ProductoAPI';

export default async function ProductosPage() {
  const productos = await ProductoAPI.obtenerListaProductos();
  console.log(productos);

  return (
    <DashboardContainer>
      <DashboardHeader heading='Productos' description='Revisa los productos del negocio' />
      <DataTableProductos columns={columnsProductos} data={productos!} />
    </DashboardContainer>
  );
}
