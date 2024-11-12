import { Producto } from "@/app/models/Producto";
import Product from "../../components/product";
import { Cliente } from "@/app/models/Cliente";
import { Role } from "@/app/models/RolEnum";

export default function ProductPage({ params }: { params: { id: string } }) {
    const { id } = params;

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
          rol: Role.CLIENTE, // Asume que el tipo Role es un string o enum con valores como "cliente", "admin", etc.
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
      

    const sample = { 
        titulo: "Chocolate Cake",
        descripcion: {
            caracteristicas: "Deliciosa torta de chocolate con 4 capas esponjosas y relleno cremoso, ¡Perfecta para los amantes del chocolate",
            calorias: 500,
        },
        precio: 8,
        stock: 22,
        proporcion: ['pequeña', "mediana", "grande"],
        imagenes: [
            "/images/Torta-Chocolate.png",
            "/images/choco-2.jpg",
            "/images/choco-3.jpg"
        ],
        reviews: [
            { cliente: sampleCliente, review: "Buenas torticas AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA", puntuacion: 4 },
            { cliente: sampleCliente, review: "Buen Choco CHOCOLATEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE", puntuacion: 3 },
            { cliente: sampleCliente, review: "Buenas Fest SAQUENME DE AQUIIIIIIIIIIIIIIIIIIIIIII", puntuacion: 2 }
        ]
    };


    const testProduct: { [key: string]: Producto } = {
        "producto": sample,
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
            <Product product={ product } rating={ rating } />
        </div>
    )
}