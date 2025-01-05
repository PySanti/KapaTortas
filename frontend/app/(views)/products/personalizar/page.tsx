import PersonalizarProduct from "../../components/producto/personalizar-product";
import ProductoAPI from "@/app/controladores/api/ProductoAPI";

export default async function PersonalizarPage() {
  try {
    const product = await ProductoAPI.obtenerProductoEspecial();

    // Si no se encuentra el producto, renderizamos un mensaje amigable.
    if (!product) {
      return (
        <div className="flex flex-col items-center justify-center h-screen">
          <h1 className="text-xl font-bold text-red-500">
            Producto no encontrado
          </h1>
          <p className="text-gray-600">
            Por favor, intenta de nuevo más tarde.
          </p>
        </div>
      );
    }

    // Renderizamos el componente si el producto existe.
    return <PersonalizarProduct product={product} />;
  } catch (error) {
    // Manejo de errores generales (problemas de red, etc.).
    console.error("Error al cargar el producto:", error);

    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-xl font-bold text-red-500">
          Ocurrió un error inesperado
        </h1>
        <p className="text-gray-600">
          Por favor, revisa tu conexión o intenta más tarde.
        </p>
      </div>
    );
  }
}
