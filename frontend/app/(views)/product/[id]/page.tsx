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
            "/images/Torta-Chocolate.png"
        ],
        reviews: [
            "Buenas torticas"
        ]
    };

    const testProduct: { [key: string]: Producto } = {
        "producto": sample,
    }
    const product: Producto = testProduct[id];

    if(!product) {
        return (
            <div>Product not found</div>
        )
    }
    // ////////////

    return (
        <div className='py-2 md:py-10 space-y-4'>
            <Product product={ product } />
        </div>
    )
}