import { MarketingConfig } from '..';
import { Producto, Categoria } from '../Producto';
import { Cliente } from '../Cliente';
import { Rol } from '../RolEnum';

export const marketingConfig: MarketingConfig = {
  mainNav: [
    { title: 'Productos', href: '#' },
    { title: 'Nosotros', href: '#' },
  ],
};

type imageType = {
  image: string;
  alt: string;
};

export type cakeType = {
  name: string;
  description: string;
  image_torta: imageType;
  image_migaja: imageType;
};

export const cakes: cakeType[] = [
  {
    name: 'Chocolate Cake',
    description:
      'Deliciosa torta de chocolate con 4 capas esponjosas y relleno cremoso, ¡Perfecta para los amantes del chocolate',
    image_torta: {
      image: '/images/Torta-Chocolate.png',
      alt: 'Torta de Chocolate',
    },
    image_migaja: {
      image: '/images/miga-Chocolate.png',
      alt: 'Migaja Chocolate',
    },
  },
  {
    name: 'Festival',
    description:
      'Colorida y deliciosa torta de 4 capas, decorada con chispitas de colores y relleno cremoso. ¡Pura diversión en cada bocado!',
    image_torta: {
      image: '/images/Torta-Festival.png',
      alt: 'Torta Festival',
    },
    image_migaja: {
      image: '/images/miga-festival.png',
      alt: 'Migaja festival',
    },
  },
];

const sampleCliente: Cliente = {
  perfil: {
    id: 1,
    nombre_completo: 'Juan Pérez',
    correo: 'juan.perez@example.com',
    contraseña: 'segura123', // En producción, evita almacenar contraseñas en texto plano.
    numero_telefonico: '+1234567890',
    fecha_nacimiento: '1990-05-15',
    link_foto: '/images/',
    rol: Rol.CLIENTE, // Asume que el tipo RolEnum es un string o enum con valores como "cliente", "admin", etc.
    stripeCustomerId: 'cus_1234567890ABC',
    is_active: true,
    is_staff: false,
    auth_token: 'asdadad',
  },
  direcciones: [
    {
      ciudad: 'Ciudad de México',
      direccion: 'Av. Reforma 123, Col. Centro',
      referencia: 'Cerca del monumento',
      pais: 'México',
      estado: 'CDMX',
      codigo_postal: '06000',
      esPreferida: true,
    },
    {
      ciudad: 'Guadalajara',
      direccion: 'Calle Hidalgo 456, Col. Americana',
      referencia: 'A una cuadra de la glorieta',
      pais: 'México',
      estado: 'Jalisco',
      codigo_postal: '44100',
      esPreferida: false,
    },
  ],
  direccion_preferida: {
    ciudad: 'Ciudad de México',
    direccion: 'Av. Reforma 123, Col. Centro',
    referencia: 'Cerca del monumento',
    pais: 'México',
    estado: 'CDMX',
    codigo_postal: '06000',
    esPreferida: true,
  },
};

const producto1: Producto = {
  producto_id: 1,
  titulo: 'Torta de Chocolate',
  categoria: Categoria.POSTRE,
  descripcion: 'Delicioso brownie de chocolate con trozos de nuez.',
  imagenes: [
    'https://res.cloudinary.com/dhxc2ozvw/image/upload/v1731461803/kapatortas/mrj1blecofoxp0cggjsc.png',
    'https://res.cloudinary.com/dhxc2ozvw/image/upload/v1731461804/kapatortas/tua2kljkkkxlxu0ontul.png',
  ],
  reviews: [
    {
      cliente: sampleCliente,
      review: 'Increíble sabor y textura. Perfecto para los amantes del chocolate.',
      puntuacion: 5,
    },
    {
      cliente: sampleCliente,
      review: 'Un poco dulce para mi gusto, pero muy rico.',
      puntuacion: 4,
    },
  ],
  presentacion: [
    {
      presentacion_id: 1,
      ref: 'Perfecto para el snack',
      proporcion: 'Pequeña',
      precio: 3.5,
      stock: 20,
      calorias: 250,
    },
    {
      presentacion_id: 2,
      ref: 'Para compartir en familia',
      proporcion: 'Grande',
      precio: 15,
      stock: 5,
      calorias: 1000,
    },
    {
      presentacion_id: 3,
      ref: 'Para ti brah',
      proporcion: 'Mediana',
      precio: 7,
      stock: 20,
      calorias: 500,
    },
  ],
};

const producto2: Producto = {
  producto_id: 2,
  titulo: 'Salsa de Caramelo',
  categoria: Categoria.POSTRE,
  descripcion: 'Salsa de caramelo perfecta para acompañar postres.',
  imagenes: ['/images/choco-2.jpg'],
  reviews: [
    {
      cliente: sampleCliente,
      review: 'Ideal para acompañar helados. ¡Recomendado!',
      puntuacion: 5,
    },
  ],
  presentacion: [
    {
      presentacion_id: 3,
      ref: 'El tamaño pequeño perfecto para ti',
      proporcion: 'Pequeña',
      precio: 2.5,
      stock: 15,
      calorias: 150,
    },
    {
      presentacion_id: 4,
      ref: 'Para compartir en familia',
      proporcion: 'Grande',
      precio: 8,
      stock: 10,
      calorias: 500,
    },
  ],
};

export const ClientePC: Producto[] = [producto1, producto2];
