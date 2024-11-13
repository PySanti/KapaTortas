import { Categoria, Producto } from "@/app/models/Producto";
import Product from "../../components/product";
import { Cliente } from "@/app/models/Cliente";
import { Rol } from "@/app/models/RolEnum";

    // ESTO ES SOLO PARA USARLO POR AHORA ANTES DE NEXTAUTH
 const sampleCliente: Cliente = {
        perfil: {
          id: 1,
          nombre_completo: "Juan Pérez",
          correo: "juan.perez@example.com",
          contraseña: "segura123",  // En producción, evita almacenar contraseñas en texto plano.
          numero_telefonico: "+1234567890",
          fecha_nacimiento: "1990-05-15",
          link_foto: "https://example.com/foto-juan.jpg",
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
    imagenes: ["/images/choco-2.jpg", "/images/choco-3.jpg"],
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
    imagenes: ["caramelo1.jpg"],
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

// EXTRAS
const producto3: Producto = {
    producto_id: 3,
    titulo: "Sirope de Fresa",
    categoria: Categoria.EXTRA,
    descripcion: "Sirope de fresa ideal para postres y bebidas.",
    presentacion: [{
        presentacion_id: 1,
        precio: 3,
        stock: 20,
    }]
};

const producto4: Producto = {
    producto_id: 4,
    titulo: "Crema Batida",
    categoria: Categoria.EXTRA,
    descripcion: "Crema batida lista para usar, perfecta para postres.",
    presentacion: [{
        presentacion_id: 1,
        precio: 2,
        stock: 20,
    }]
};

// This will be extracted from the DB
const extraList: Producto[] = [producto3, producto4];

export default function ProductPage({ params }: { params: { id: string } }) {
    const { id } = params;

    const testProduct: { [key: string]: Producto } = {
        "producto": producto1,
    }
    const product: Producto = testProduct[id];

    // Esto debería suceder en el back
    const rating: number | undefined =  product?.reviews ? product.reviews.reduce((sum, item) => sum + item.puntuacion, 0) / product.reviews.length : undefined;

    if(!product) {
        return (
            <div>Product not found</div>
        )
    }
    // ////////////

    return (
        <div className='py-2 md:py-10 space-y-4 '>
            <Product product={ product } extraList={extraList} rating={ rating } />
        </div>
    )
}