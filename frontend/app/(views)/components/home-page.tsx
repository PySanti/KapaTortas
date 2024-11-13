'use client';

import { useRef, useState } from 'react';
import { Cliente } from '@/app/models/Cliente';
import ClienteAPI from '@/app/controladores/api/users/ClienteAPI';
import MainHome from './main-home';
import ProductoHome from './producto-home';
import { cakes } from '@/app/models/config/marketing';
import { useSmoothScroll } from '@/app/controladores/utilities/useSmoothScroll';

import { Rol } from '@/app/models/RolEnum';
import { Categoria } from '@/app/models/Producto';
import { Producto } from '@/app/models/Producto';

const sampleCliente: Cliente = {
  perfil: {
    id: 1,
    nombre_completo: "Juan Pérez",
    correo: "juan.perez@example.com",
    contraseña: "segura123",  // En producción, evita almacenar contraseñas en texto plano.
    numero_telefonico: "+1234567890",
    fecha_nacimiento: "1990-05-15",
    link_foto: "/images/",
    rol: Rol.CLIENTE, // Asume que el tipo RolEnum es un string o enum con valores como "cliente", "admin", etc.
    stripeCustomerId: "cus_1234567890ABC",
    is_active: true,
    is_staff: false
  },
  direcciones: [
    {
      ciudad: "Ciudad de México",
      direccion: "Av. Reforma 123, Col. Centro",
      referencia: "Cerca del monumento",
      pais: "México",
      estado: "CDMX",
      codigo_postal: "06000",
      esPreferida: true
    },
    {
      ciudad: "Guadalajara",
      direccion: "Calle Hidalgo 456, Col. Americana",
      referencia: "A una cuadra de la glorieta",
      pais: "México",
      estado: "Jalisco",
      codigo_postal: "44100",
      esPreferida: false
    }
  ]
};


const producto1: Producto = {
producto_id: 1,
titulo: "Torta de Chocolate",
categoria: Categoria.POSTRE,
descripcion: "Delicioso brownie de chocolate con trozos de nuez.",
imagenes: ["https://res.cloudinary.com/dhxc2ozvw/image/upload/v1731461803/kapatortas/mrj1blecofoxp0cggjsc.png", "https://res.cloudinary.com/dhxc2ozvw/image/upload/v1731461804/kapatortas/tua2kljkkkxlxu0ontul.png"],
reviews: [
  {
      cliente: sampleCliente,
      review: "Increíble sabor y textura. Perfecto para los amantes del chocolate.",
      puntuacion: 5
  },
  {
      cliente: sampleCliente,
      review: "Un poco dulce para mi gusto, pero muy rico.",
      puntuacion: 4
  }
],
presentacion: [
  {
      presentacion_id: 1,
      ref: "Perfecto para el snack",
      proporcion: "Pequeña",
      precio: 3.5,
      stock: 20,
      calorias: 250
  },
  {
      presentacion_id: 2,
      ref: "Para compartir en familia",
      proporcion: "Grande",
      precio: 15,
      stock: 5,
      calorias: 1000
  },
  {
      presentacion_id: 3,
      ref: "Para ti brah",
      proporcion: "Mediana",
      precio: 7,
      stock: 20,
      calorias: 500
  },
]
};

const producto2: Producto = {
producto_id: 2,
titulo: "Salsa de Caramelo",
categoria: Categoria.POSTRE,
descripcion: "Salsa de caramelo perfecta para acompañar postres.",
imagenes: ["/images/choco-2.jpg"],
reviews: [
  {
      cliente: sampleCliente,
      review: "Ideal para acompañar helados. ¡Recomendado!",
      puntuacion: 5
  }
],
presentacion: [
  {
      presentacion_id: 3,
      ref: "El tamaño pequeño perfecto para ti",
      proporcion: "Pequeña",
      precio: 2.5,
      stock: 15,
      calorias: 150
  },
  {
      presentacion_id: 4,
      ref: "Para compartir en familia",
      proporcion: "Grande",
      precio: 8,
      stock: 10,
      calorias: 500
  }
]
};

const productos: Producto[] = [producto1, producto2];


export default function HomePage({}) {
  const sectionCatalogoRef = useRef<HTMLDivElement>(null);
  const scrollToSection = useSmoothScroll(sectionCatalogoRef);

  return (
    <>
      <MainHome scrollToSection={ scrollToSection } />
      <section ref={ sectionCatalogoRef } className='w-full mb-20'>
        <div className='relative '>
          <div className='m-4 md:m-2 p-6 md:p-8 lg:p-10'>
            <h1 className='text-primary text-4xl lg:text-6xl'>Nuestras Tortas</h1>
            {/* <span>-----</span> */}
          </div>
          <div className='container mx-auto px-4'>
            <div className='flex flex-col gap-16'>
              {productos.map((product, index) => {
                return (
                  <div key={index} className='w-full'>
                    <ProductoHome key={index} product={ product } />
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
