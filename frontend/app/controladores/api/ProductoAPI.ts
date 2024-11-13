import { Producto } from "@/app/models/Producto";

class ProductoAPI {
  private static instance: ProductoAPI;

  private constructor() {}

  // Metodo para obtener la instancia
  public static getInstance(): ProductoAPI {
    if (!ProductoAPI.instance) {
      ProductoAPI.instance = new ProductoAPI();
    }
    return ProductoAPI.instance;
  }

  // Metodo para obtener el Producto
  // Cambiar T por Producto[]
  public async obtenerListaProductos(): Promise<Producto[] | null> {
    const url = `http://localhost:8000/api/productos/todos`;

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "applications/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Error en la conexión, Status: ${response.status}`);
      }

      const data = await response.json();

      return data.productos;
    } catch (err) {
      console.error("Error en la petición de los productos: ", err);
      return null;
    }
  }

  public async obtenerProducto(id: number): Promise<Producto | null> {
    const url = `http://localhost:8000/api/productos/${encodeURIComponent(id)}`;

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Error en la base de datos: ${response.status}`);
      }

      const data = await response.json();
      console.log(data);

      return data;
    } catch (err) {
      console.error("Error en la petición del producto: ", err);
      return null;
    }
  }
}

export default ProductoAPI.getInstance();
