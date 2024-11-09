'use client';

import { useState } from 'react';
import KapaTortasVerifyEmail from './verification-email';
import { Perfil } from '@/app/models/Perfil';
import obtenerPerfilPorCorreo from '@/app/utilities/obtenerPerfilPorCorreo';

export default function HomePage({}) {
  return (
    <>
      <PerfilTesteo />
    </>
  );
}

// Esto esta malo, deberiamos traer el Perfil en contexto, es para testear.
const PerfilTesteo: React.FC = () => {
  const [perfil, setPerfil] = useState<Perfil | null>();
  const [email, setEmail] = useState<string>('');
  const [error, setError] = useState<string | null>();

  const handleFetchPerfil = async () => {
    const fetchPerfil = await obtenerPerfilPorCorreo(email);
    if (fetchPerfil) {
      setPerfil(fetchPerfil);
      setError(null);
    } else {
      setError('Perfil no encontrado');
    }
  };

  return (
    <>
      <h2 className='text-2xl p-20'>Testing del perfil</h2>
      <div className='p-5'>
        <input
          type='text'
          placeholder='Pon el texto'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button className='bg-green-300 p-5 rounded-lg ' onClick={handleFetchPerfil}>
          Consulta el perfil
        </button>
      </div>

      {error && <p>{error}</p>}

      {perfil ? (
        <div className='p-20 text-sm'>
          <h2 className='text-black text-2xl'>Perfil de {perfil.nombre_completo}</h2>
          <h2 className='text-black text-2xl'>Correo: {perfil.correo}</h2>
        </div>
      ) : (
        <p>Introduce un correo</p>
      )}
    </>
  );
};

// export default PerfilTesteo;
