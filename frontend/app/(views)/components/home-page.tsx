'use client';

import { useState } from 'react';
import { Cliente } from '@/app/models/Cliente';
import ClienteAPI from '@/app/controladores/api/users/ClienteAPI';
import MainHome from './main-home';
import ProductoHome from './producto-home';
import { cakes } from '@/app/models/config/marketing';

export default function HomePage({}) {
  return (
    <>
      <MainHome />
      <section className='w-full mb-20'>
        <div className='relative '>
          <div className='m-4 md:m-2 p-6 md:p-8 lg:p-10'>
            <h1 className='text-primary text-4xl lg:text-6xl'>Nuestras Tortas</h1>
            {/* <span>-----</span> */}
          </div>
          <div className='container mx-auto px-4'>
            <div className='flex flex-col gap-16'>
              {cakes.map((item, index) => {
                return (
                  <div key={index} className='w-full'>
                    <ProductoHome key={index} item={item} />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

// Esto esta malo, deberiamos traer el Perfil en contexto, es para testear.
const PerfilTesteo: React.FC = () => {
  const [cliente, setCliente] = useState<Cliente | null>();
  const [email, setEmail] = useState<string>('');
  const [error, setError] = useState<string | null>();

  const getCliente = async () => {
    try {
      const cliente = await ClienteAPI.obtenerCliente(email);
      if (cliente) {
        setCliente(cliente);
      } else {
        setError('Cliente no encontrado');
      }
    } catch (err) {
      setError('Hubo un problema al consultar el perfil');
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
        <button className='bg-green-300 p-5 rounded-lg ' onClick={getCliente}>
          Consulta el perfil
        </button>
      </div>

      {error && <p>{error}</p>}

      {cliente ? (
        <div className='p-20 text-sm'>
          <h2 className='text-black text-2xl'>Perfil de {cliente.perfil.nombre_completo}</h2>
          <h2 className='text-black text-2xl'>Num: {cliente.perfil.numero_telefonico}</h2>
          <h2 className='text-black text-2xl'>Correo: {cliente.perfil.nombre_completo}</h2>
        </div>
      ) : (
        <p>Introduce un correo</p>
      )}
    </>
  );
};

// export default PerfilTesteo;
