import DashboardContainer from '../../components/dashboard-container';
import { DashboardHeader } from '../../components/dashboard-header';

export default function OrdenesPage() {
  return (
    <DashboardContainer>
      <DashboardHeader
        heading='Pedidos'
        description='Revisa el estado de tus pedidos y realiza cambios si es necesario'
      />
    </DashboardContainer>
  );
}
