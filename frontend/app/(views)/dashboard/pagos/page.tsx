import DashboardContainer from '../../components/dashboard-container';
import { DashboardHeader } from '../../components/dashboard-header';

export default function PagosPage() {
  return (
    <DashboardContainer>
      <DashboardHeader
        heading='Pagos'
        description='Ve todas las transacciones y gestiona tus métodos de pago'
      />
    </DashboardContainer>
  );
}
