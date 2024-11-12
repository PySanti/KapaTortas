import { DireccionEnvio } from '@/app/models/Cliente';
import DashboardContainer from '../../components/dashboard-container';
import { DashboardHeader } from '../../components/dashboard-header';
import DireccionEnvioCard from '../../components/direccion-envio-card';

const sampleAddress: DireccionEnvio = {
  ciudad: 'Montreal',
  direccion: 'Rue de Mentana',
  referencia: '', // Optional second line of the address
  pais: 'Canada',
  estado: 'Quebec', // Optional state or province
  codigo_postal: 'H2L3R4',
  esPreferida: true, // Indicate this is the preferred address
};

const cliente = {
  nombre_completo: 'Samuel Palacios',
  numeroTelefono: '(424) 123-4567',
};

const sampleAddress2: DireccionEnvio = {
  ciudad: 'Toronto',
  direccion: 'Bloor Street West',
  referencia: 'Near High Park', // Optional second line of the address
  pais: 'Canada',
  estado: 'Ontario', // Optional state or province
  codigo_postal: 'M6P 1A4',
  esPreferida: false, // Indicate this is not the preferred address
};

const cliente2 = {
  nombre_completo: 'Maria Gonzalez',
  numeroTelefono: '(412) 987-6543',
};

export default function DireccionesPage() {
  return (
    <DashboardContainer>
      <DashboardHeader
        heading='Direcciones'
        description='Edita, elimina o establece una dirección de envío predeterminada'
      />
      <DireccionEnvioCard
        nombreCompleto={cliente.nombre_completo}
        direccion={sampleAddress}
        numeroTelefono={cliente.numeroTelefono}
      />
      <DireccionEnvioCard
        nombreCompleto={cliente2.nombre_completo}
        direccion={sampleAddress2}
        numeroTelefono={cliente2.numeroTelefono}
      />
      <DireccionEnvioCard
        nombreCompleto={cliente.nombre_completo}
        direccion={sampleAddress}
        numeroTelefono={cliente.numeroTelefono}
      />
    </DashboardContainer>
  );
}
