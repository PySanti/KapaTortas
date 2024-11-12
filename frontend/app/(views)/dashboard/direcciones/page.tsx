import DashboardContainer from '../../components/dashboard-container';
import { DashboardHeader } from '../../components/dashboard-header';
import DireccionEnvioCard from '../../components/direccion-envio-card';

const sampleAddress = {
  direccion_1: 'Rue de Mentana',
  direccion_2: '', // Optional second line of the address
  ciudad: 'Montreal',
  pais: 'Canada',
  estado: 'Quebec', // Optional state or province
  codigo_postal: 'H2L3R4',
  numero_telefono: '(424) 123-4567',
  esPreferida: true, // Indicate this is the preferred address
  nombre_recibidor: 'Samuel Palacios',
};

export default function DireccionesPage() {
  return (
    <DashboardContainer>
      <DashboardHeader
        heading='Direcciones'
        description='Edita, elimina o establece una dirección de envío predeterminada'
      />
      <DireccionEnvioCard
        nombreCompleto={sampleAddress.nombre_recibidor}
        direccion={sampleAddress}
      />
    </DashboardContainer>
  );
}
