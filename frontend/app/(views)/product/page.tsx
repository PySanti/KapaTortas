export default function ProductPage({ params }: { params: { id: string } }) {
    const { id } = params;

    // ESTO ES SOLO PARA USARLO POR AHORA ANTES DE NEXTAUTH
    const testProduct: { [key: string]: { name: string } } = {
        "producto": {name: "Daniel" },
    }
    const product = testProduct[id];

    if(!product) {
        return (
            <div>Product not found</div>
        )
    }
    // ////////////

    return (
        <div>
            {/* <Product product={ product } /> */}
        </div>
    )
}