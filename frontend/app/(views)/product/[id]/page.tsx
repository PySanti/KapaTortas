import { Producto } from "@/app/models/Producto";
import Product from "../../components/product";

export default function ProductPage({ params }: { params: { id: string } }) {
    const { id } = params;

    // ESTO ES SOLO PARA USARLO POR AHORA ANTES DE NEXTAUTH
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
            { review: "Buenas torticas", puntuacion: 4 },
            { review: "Buen Choco", puntuacion: 3 },
            { review: "Buenas Fest", puntuacion: 2 }
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