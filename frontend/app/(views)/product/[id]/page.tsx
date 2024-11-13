import { Categoria, Producto } from "@/app/models/Producto";
import Product from "../../components/product";
import { Cliente } from "@/app/models/Cliente";
import { Rol } from "@/app/models/RolEnum";


export default function ProductPage({ params }: { params: { id: string } }) {
    const { id } = params;

    return (
        <div>
            <Product id={id} />
        </div>
    )
}